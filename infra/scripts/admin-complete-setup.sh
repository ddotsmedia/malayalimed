#!/bin/bash
# Complete admin user setup: create + set password hash

set -e
cd /opt/malayalimed

echo "========== STEP 1: Check if admin user exists =========="
ADMIN_EXISTS=$(docker exec docker-mm-postgres-1 psql -U mm -d malayalimed -t -c \
  "SELECT COUNT(*) FROM users WHERE email='admin@malayalimed.com';")

echo "Admin user exists: $ADMIN_EXISTS"

echo ""
echo "========== STEP 2: Generate password hash =========="
# Generate hash using PostgreSQL's pgcrypto extension (crypt with bcrypt)
# This generates a bcrypt hash compatible with Node.js bcryptjs
HASH=$(docker exec docker-mm-postgres-1 psql -U mm -d malayalimed -t -c \
  "SELECT crypt('admin123', gen_salt('bf', 10));" 2>/dev/null | tr -d ' ')

if [ -z "$HASH" ] || [ "$HASH" = "" ]; then
  echo "❌ Failed to generate hash with PostgreSQL crypt()"
  echo "Trying alternative method..."

  # Fallback: use bcryptjs in Node.js container
  HASH=$(docker exec docker-mm-web-1 node -e "
    import bcrypt from 'bcryptjs';
    const hash = bcrypt.hashSync('admin123', 10);
    console.log(hash);
  " 2>/dev/null || echo "")

  if [ -z "$HASH" ]; then
    echo "❌ Both hash methods failed. Manual setup required."
    exit 1
  fi
fi

echo "✅ Hash generated: ${HASH:0:20}..."

echo ""
echo "========== STEP 3: Create or update admin user =========="

if [ "$ADMIN_EXISTS" -eq 0 ]; then
  echo "Creating new admin user..."
  docker exec docker-mm-postgres-1 psql -U mm -d malayalimed << SQL
INSERT INTO users (id, email, full_name, mobile, role, password_hash, is_verified, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@malayalimed.com',
  'Administrator',
  '+919999999999',
  'platform_admin',
  '$HASH',
  true,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;
SQL
else
  echo "Updating existing admin user password..."
  docker exec docker-mm-postgres-1 psql -U mm -d malayalimed -c \
    "UPDATE users SET password_hash = '$HASH', updated_at = NOW() WHERE email = 'admin@malayalimed.com';"
fi

echo "✅ Admin user ready"

echo ""
echo "========== STEP 4: Verify user in database =========="
docker exec docker-mm-postgres-1 psql -U mm -d malayalimed -c \
  "SELECT email, role, is_verified, SUBSTRING(password_hash, 1, 20) || '...' AS hash_preview FROM users WHERE email='admin@malayalimed.com';"

echo ""
echo "========== STEP 5: Test login =========="
echo "Waiting 5 seconds for DB to sync..."
sleep 5

LOGIN_RESPONSE=$(curl -s -X POST https://malayalimed.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@malayalimed.com","password":"admin123"}')

echo "Login response:"
echo "$LOGIN_RESPONSE" | jq . 2>/dev/null || echo "$LOGIN_RESPONSE"

if echo "$LOGIN_RESPONSE" | grep -q '"token"\|"data"'; then
  echo ""
  echo "✅ LOGIN SUCCESSFUL"
  echo ""
  echo "Admin credentials:"
  echo "  Email: admin@malayalimed.com"
  echo "  Password: admin123"
  echo ""
  echo "Access admin panel:"
  echo "  1. Go to: https://malayalimed.com/admin/login"
  echo "  2. Enter credentials above"
  echo "  3. You should see: /admin/dashboard"
else
  echo ""
  echo "❌ Login failed"
  echo "Debugging:"
  echo "  1. Check if user was created: SELECT * FROM users WHERE email='admin@malayalimed.com';"
  echo "  2. Check password hash: $HASH"
  echo "  3. Verify @mm/auth verifyPassword() function"
fi

echo ""
echo "========== ADMIN SETUP COMPLETE =========="
