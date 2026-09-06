#!/bin/bash
# Fix admin password hash using SCRYPT (correct format)

set -e
cd /opt/malayalimed

echo "========== STEP 1: Verify admin user exists =========="
docker exec docker-mm-postgres-1 psql -U mm -d malayalimed -c \
  "SELECT email, role FROM users WHERE email='admin@malayalimed.com';"

echo ""
echo "========== STEP 2: Generate SCRYPT hash =========="
echo "Creating Node.js hash generator..."

# Create script using @mm/auth.hashPassword() which generates scrypt format
cat > /tmp/gen-hash.mjs << 'HASHSCRIPT'
import { hashPassword } from '/opt/malayalimed/services/auth/password.js';
const hash = hashPassword('admin123');
console.log(hash);
HASHSCRIPT

echo "Running hash generator in web container..."
HASH=$(docker exec docker-mm-web-1 node /tmp/gen-hash.mjs 2>&1 | grep -E '^scrypt\$' | tail -1)

if [ -z "$HASH" ]; then
  echo "❌ Failed to generate scrypt hash"
  echo "Trying alternative: run directly in container..."
  HASH=$(docker exec docker-mm-web-1 node -e "
    import { hashPassword } from './services/auth/password.js';
    console.log(hashPassword('admin123'));
  " 2>&1 | grep -E '^scrypt\$' | tail -1)
fi

if [ -z "$HASH" ]; then
  echo "❌ Both methods failed to generate hash"
  echo "Requirements: Node.js must have access to @mm/auth module"
  exit 1
fi

echo "✅ Generated scrypt hash:"
echo "   ${HASH:0:50}..."

echo ""
echo "========== STEP 3: Update database =========="
docker exec docker-mm-postgres-1 psql -U mm -d malayalimed << SQL
UPDATE users
SET password_hash = '$HASH', updated_at = NOW()
WHERE email = 'admin@malayalimed.com';

SELECT email, SUBSTRING(password_hash, 1, 30) || '...' FROM users WHERE email = 'admin@malayalimed.com';
SQL

echo "✅ Database updated"

echo ""
echo "========== STEP 4: Wait for DB sync =========="
sleep 3

echo ""
echo "========== STEP 5: Test login endpoint =========="
LOGIN_RESPONSE=$(curl -s -X POST https://malayalimed.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@malayalimed.com","password":"admin123"}')

echo "Response:"
echo "$LOGIN_RESPONSE" | jq . 2>/dev/null || echo "$LOGIN_RESPONSE"

if echo "$LOGIN_RESPONSE" | grep -q '"token"'; then
  TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token' 2>/dev/null)
  ROLE=$(echo "$LOGIN_RESPONSE" | jq -r '.data.user.role' 2>/dev/null)

  echo ""
  echo "✅ LOGIN SUCCESSFUL"
  echo "   Token: ${TOKEN:0:30}..."
  echo "   Role: $ROLE"

  echo ""
  echo "========== ADMIN CREDENTIALS =========="
  echo "Email: admin@malayalimed.com"
  echo "Password: admin123"
  echo "URL: https://malayalimed.com/admin/login"
  echo "Dashboard: https://malayalimed.com/admin/dashboard"
else
  ERROR=$(echo "$LOGIN_RESPONSE" | jq -r '.errors[0]' 2>/dev/null)
  echo ""
  echo "❌ Login failed"
  echo "   Error: $ERROR"
  echo ""
  echo "Debugging:"
  echo "  1. Verify password_hash in DB:"
  docker exec docker-mm-postgres-1 psql -U mm -d malayalimed -c \
    "SELECT email, password_hash FROM users WHERE email='admin@malayalimed.com';"
  echo "  2. Hash should start with: scrypt\$"
  echo "  3. If hash is wrong, run this script again"
fi

echo ""
echo "========== SCRYPT HASH FIX COMPLETE =========="
