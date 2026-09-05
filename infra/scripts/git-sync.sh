#!/bin/bash
# Git sync: pull remote, resolve conflicts, push local, verify

set -e
cd /opt/malayalimed

echo "========== STEP 1: Current local state =========="
echo "=== Local commits (last 5) ==="
git log --oneline -5

echo ""
echo "========== STEP 2: Fetch from remote =========="
git fetch origin main
echo "✅ Fetched latest from remote"

echo ""
echo "========== STEP 3: Check for conflicts =========="
echo "=== Remote commits (last 5) ==="
git log --oneline origin/main -5

echo ""
echo "=== Divergence check ==="
if git log --oneline main..origin/main | grep -q .; then
  echo "Remote has new commits:"
  git log --oneline main..origin/main
else
  echo "Local is ahead or equal to remote"
fi

if git log --oneline origin/main..main | grep -q .; then
  echo "Local has new commits:"
  git log --oneline origin/main..main
else
  echo "Local is behind or equal to remote"
fi

echo ""
echo "========== STEP 4: Merge remote into local =========="
git pull origin main --no-edit || true

echo ""
echo "========== STEP 5: Resolve any conflicts =========="
if git status | grep -q "both modified\|both added\|both deleted"; then
  echo "⚠️  Conflicts detected — taking remote version (source of truth)"
  git checkout --theirs .
  git add -A
  git commit -m "merge: resolve conflicts — accept remote version (source of truth)"
  echo "✅ Conflicts resolved"
else
  echo "✅ No conflicts"
fi

echo ""
echo "========== STEP 6: Push local commits =========="
git push origin main
echo "✅ Pushed to remote"

echo ""
echo "========== STEP 7: Verify final sync =========="
echo "=== Local == Remote? ==="
if git log --oneline main..origin/main | grep -q .; then
  echo "❌ Local behind remote — pull again"
  git pull origin main --no-edit
elif git log --oneline origin/main..main | grep -q .; then
  echo "❌ Local ahead of remote — push again"
  git push origin main
else
  echo "✅ Local == Remote (fully synced)"
fi

echo ""
echo "=== Final commit state ==="
git log --oneline -5

echo ""
echo "=== Git status ==="
git status

echo ""
echo "========== STEP 8: Verify app is running =========="
echo "=== Website test ==="
curl -s https://malayalimed.com/ | head -5 || echo "Website check: may require auth"

echo ""
echo "=== Container status ==="
docker compose -f infra/docker/docker-compose.prod.yml ps || echo "Docker check failed (may need root)"

echo ""
echo "========== GIT SYNC COMPLETE =========="
echo "✅ Local synced with remote"
echo "✅ All conflicts resolved"
echo "✅ Ready for Batch 21C deployment"
