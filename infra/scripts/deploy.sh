#!/usr/bin/env bash
# MalayaliMed deploy — build + migrate + recreate the web container.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE="$REPO_ROOT/infra/docker/docker-compose.prod.yml"
cd "$REPO_ROOT"

echo "==> 1/4 Pull latest"
git pull --ff-only origin main || true

echo "==> 2/4 Datastores"
docker compose -f "$COMPOSE" up -d mm-postgres mm-redis
for _ in $(seq 1 30); do docker compose -f "$COMPOSE" exec -T mm-postgres pg_isready -U mm -d malayalimed >/dev/null 2>&1 && break; sleep 2; done

echo "==> 3/4 Migrate"
set -a; [ -f .env.production ] && . ./.env.production; set +a
DATABASE_URL="${DATABASE_URL:-postgres://mm:${POSTGRES_PASSWORD:-mm}@127.0.0.1:5432/malayalimed}" pnpm db:migrate

echo "==> 4/4 Build + recreate web"
docker compose -f "$COMPOSE" up -d --build mm-web
sleep 5
docker compose -f "$COMPOSE" ps
curl -s -o /dev/null -w "web health -> %{http_code}\n" http://127.0.0.1:3000/api/health || true
echo "Deployment complete."
