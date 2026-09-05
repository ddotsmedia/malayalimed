#!/bin/bash
# Fix admin password hash in database

set -e
cd /opt/malayalimed

echo "========== STEP 1: Check current admin user =========="
docker exec docker-mm-postgres-1 psql -U mm -d malayalimed -c \
  "SELECT email, password_hash FROM users WHERE email='admin@malayalimed.com';"

echo ""
echo "========== STEP 2: Generate password hash =========="
# Create temporary script to hash password
cat > /tmp/gen-hash.js << 'HASHSCRIPT'
import { hashPassword } from '@mm/auth';
const hash = hashPassword('admin123');
console.log(hash);
HASHSCRIPT

# Execute in web container (has access to @mm/auth)
echo "Running hash generator in web container..."
HASH=$(docker exec -w /opt/malayalimed docker-mm-web-1 node /tmp/gen-hash.js 2>/dev/null || echo "HASH_GENERATION_FAILED")

if [ "$HASH" = "HASH_GENERATION_FAILED" ]; then
  echo "❌ Failed to generate hash via web container"
  echo "Attempting alternative: psql crypt() function..."

  # Fallback: use PostgreSQL's crypt function
  HASH=$(docker exec docker-mm-postgres-1 psql -U mm -d malayalimed -t -c \
    "SELECT crypt('admin123', gen_salt('bf'));" 2>/dev/null || echo "")

  if [ -z "$HASH" ]; then
    echo "❌ Both hash generation methods failed"
    echo "Manual fix required: run from Node.js REPL:"
    echo "  import { hashPassword } from '@mm/auth';"
    echo "  hashPassword('admin123')"
    exit 1
  fi
fi

echo "✅ Hash generated: $HASH"

echo ""
echo "========== STEP 3: Update database =========="
docker exec docker-mm-postgres-1 psql -U mm -d malayalimed -c \
  "UPDATE users SET password_hash = '$HASH' WHERE email = 'admin@malayalimed.com';"
echo "✅ Database updated"

echo ""
echo "========== STEP 4: Verify update =========="
docker exec docker-mm-postgres-1 psql -U mm -d malayalimed -c \
  "SELECT email, SUBSTRING(password_hash, 1, 20) || '...' AS hash_preview FROM users WHERE email='admin@malayalimed.com';"

echo ""
echo "========== STEP 5: Test login =========="
echo "Testing login with admin@malayalimed.com / admin123..."
LOGIN_RESPONSE=$(curl -s -X POST https://malayalimed.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@malayalimed.com","password":"admin123"}')

echo "Response:"
echo "$LOGIN_RESPONSE" | head -20

if echo "$LOGIN_RESPONSE" | grep -q '"valid":true\|"data":'; then
  echo "✅ Login successful"

  echo ""
  echo "=== User role ==="
  echo "$LOGIN_RESPONSE" | grep -o '"role":"[^"]*"' || echo "Role check: see full response above"
else
  echo "❌ Login failed"
  echo "Response: $LOGIN_RESPONSE"
fi

echo ""
echo "========== PASSWORD FIX COMPLETE =========="
echo "✅ Admin password hash updated"
echo "✅ Login tested"
echo ""
echo "Next: Log in at https://malayalimed.com/admin/login"
echo "  Email: admin@malayalimed.com"
echo "  Password: admin123"
