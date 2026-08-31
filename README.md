# MalayaliMed

Kerala-first digital healthcare platform — doctor & hospital directories, appointments, health hubs, and a job portal. Malayalam-first (ml/en).

## Stack
Next.js 15.5 (App Router, JavaScript) · React 18 · PostgreSQL 15 · Redis 7 · Tailwind · pnpm workspace · Docker.

## Structure
```
apps/web/            Next.js app (pages, API routes, components, lib)
services/db/         pg pool, sql helpers, migration runner + migrations
services/cache/      in-process cache (Redis-swappable interface)
services/auth/       JWT (HS256) + scrypt password hashing
infra/docker/        Dockerfile.web + docker-compose.prod.yml
infra/scripts/       deploy.sh
```

## Develop
```bash
pnpm install
cp .env.example .env            # set DATABASE_URL etc.
pnpm db:migrate                 # apply migrations
pnpm dev                        # http://localhost:3000/ml
```

## Deploy
```bash
bash infra/scripts/deploy.sh    # build + migrate + recreate web container
```

## What's included
- **20 migrations** (users, doctors, hospitals, appointments, reviews, payments, prescriptions, notifications, audit, jobs + reference seed).
- **Pages:** home, doctors (+ profile), hospitals (+ profile), jobs, women's/mental/child health hubs.
- **APIs:** health, doctors (list/detail), hospitals, appointments (book/list), auth (register/login).
- **Components:** Navbar, Footer, DoctorCard, HospitalCard, JobCard, SearchBar, SpecialtyFilter, RatingDisplay, HealthHub, EmptyState, LoadingSpinner.
- **lib:** i18n, doctors, hospitals, appointments, jobs, reference, validators, formatters, constants, session.

## Admin, payments, video
- **Admin panel** at `/admin` (platform_admin only): dashboard, users, doctors (verify/reject), hospitals, appointments, analytics, reports, settings + admin APIs.
- **Payments** via Stripe Checkout over the REST API (no `@stripe` package) — simulates without `STRIPE_SECRET_KEY`. Endpoints: `/api/payments/{create-intent,confirm,refund}`; `PaymentForm` component.
- **Video consultations** via a Jitsi Meet iframe (`VideoConsultation`) + `/api/appointments/[id]/video-room`; wired into `/[locale]/appointments/[id]`.

## Production
Server **187.127.185.239** · `malayalimed.com`. See `docs/DEPLOYMENT.md` for DNS, Let's Encrypt SSL, backups, and monitoring.

See `BLOCKERS.md` for honest build/scope status.
