# MalayaliMed — Deployment

Production server: **187.127.185.239** · Domain: **malayalimed.com** · App path: `/opt/malayalimed`

## 1. DNS (registrar)
| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | `@` | `187.127.185.239` | 3600 |
| A | `www` | `187.127.185.239` | 3600 |

Verify: `dig +short malayalimed.com` → `187.127.185.239`.

## 2. First deploy
```bash
ssh root@187.127.185.239
cd /opt/malayalimed
git pull origin main
cp .env.example .env.production   # fill DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY, JITSI_DOMAIN
bash infra/scripts/deploy.sh      # build + migrate + start containers
```

## 3. SSL / HTTPS (Let's Encrypt)
Nginx terminates TLS in front of the web container (`127.0.0.1:3000`).
```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d malayalimed.com -d www.malayalimed.com --redirect
```
`--redirect` forces HTTP→HTTPS. Certbot installs a systemd timer that auto-renews;
check with `systemctl list-timers | grep certbot` and dry-run `certbot renew --dry-run`.

### Nginx site (sites-available/malayalimed.com.conf)
```nginx
server {
  server_name malayalimed.com www.malayalimed.com;
  location / { proxy_pass http://127.0.0.1:3000; proxy_set_header Host $host;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; }
}
```
`nginx -t && systemctl reload nginx` after edits.

## 4. Backups
Nightly PostgreSQL dump (cron `0 2 * * *`):
```bash
docker exec mm-postgres pg_dump -U mm malayalimed | gzip > /opt/backups/mm-$(date +\%F).sql.gz
find /opt/backups -name 'mm-*.sql.gz' -mtime +14 -delete
```
Restore: `gunzip -c mm-DATE.sql.gz | docker exec -i mm-postgres psql -U mm -d malayalimed`.

## 5. Monitoring
- Health: `curl -f https://malayalimed.com/api/health` (200 = DB reachable). Wire to UptimeRobot / a cron alert.
- Containers: `docker compose -f infra/docker/docker-compose.prod.yml ps`.
- Logs: `docker compose ... logs -f mm-web`.

## 6. Environment variables
```
DATABASE_URL, REDIS_URL, JWT_SECRET, JWT_REFRESH_SECRET,
NEXT_PUBLIC_APP_URL=https://malayalimed.com, NEXT_PUBLIC_DEFAULT_LOCALE=ml,
STRIPE_SECRET_KEY (optional — payments simulate without it),
JITSI_DOMAIN (optional — defaults to meet.jit.si)
```
