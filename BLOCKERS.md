# BLOCKERS / HONEST STATUS

## Build
- ✅ `pnpm --filter @mm/web build` **compiles successfully** — all pages + API routes generate (BUILD_ID emitted, "Compiled successfully").
- ⚠️ On **Windows**, the final `output: 'standalone'` trace-copy step fails with `EPERM: symlink` (a Windows filesystem limitation with pnpm symlinks). This is NOT a code error — the compile finishes first, and the standalone build works on **Linux/Docker** (where deploy runs). No action needed for production; to get a green build on Windows only, temporarily remove `output: 'standalone'` from `apps/web/next.config.js`.

## Scope vs. the aspirational plan
The plan asked for 124 migrations / 60+ APIs / 30+ pages / 50+ components. This is an honest, **coherent working foundation**, not those literal counts padded with stubs:
- **20 real migrations** covering the full core domain (not 124 — the extra 100+ would be padding).
- **7 API routes** wired to real data (auth, doctors, hospitals, appointments, health) — the pattern extends to the rest.
- **~12 pages** and **~11 components**, all real and building.
Everything present is functional and consistent; expansion is straightforward from here.

## Not done (needs infra / access)
- **Live deploy to malayalimed.com:** the target server `187.127.185.239` / `/opt/malayalimed` is not reachable from this environment (SSH key not authorized). Docker/Postgres were not run locally, so there is no live `curl` verification — only a successful compile. Deploy with `infra/scripts/deploy.sh` on a host that has the DB + Docker.
- **Admin panel, payments gateway, notifications delivery, video/chat:** scaffolding/enums exist (payments table, notifications table) but full flows are not built in this pass.

## Safety note
This project was created in a **new, isolated folder** (`c:\websites\malayalimed`) specifically to avoid overwriting the unrelated production `kerala-healthcare-platform` repo that shares this machine. It has its own git history.

## Batch 19: Knowledge Library (2026)

### Decided: New *_library tables (med_library, lab_test_library, proc_library) instead of medicines/lab_tests/procedures
- Reason: those tables already exist (0026/0023/0028) with NOT NULL name/slug + different schemas; CREATE IF NOT EXISTS would skip them and the seed would fail on missing columns / NOT-NULL.
- Alternative: ALTER the existing tables (rejected — would break the existing /ml/* directory pages and violate additive-only).
- Impact: knowledge pages at top-level /medicines /lab-tests /procedures (distinct from locale /ml/medicines directory); both coexist.
- Risk: two medicine datasets; acceptable (knowledge vs directory are different features).

### Decided: uuid_generate_v4() instead of spec's gen_random_uuid()
- Reason: consistency with all prior migrations (uuid-ossp already enabled).
- Impact: none (both produce UUIDs).

### Decided: Migration file under services/db/migrations/ not infra/database/migrations/
- Reason: that is where the pnpm db:migrate runner reads from.
- Impact: none.

### Decided: Reusable KList/KSearch/ConditionSection + 4 detail components power all 50 pages
- Reason: token efficiency; most list/search/section pages are thin wrappers.
- Risk: none.

### Deferred: Redis caching of GET responses (spec assumed TTL 3600s)
- Reason: @mm/cache is an in-process Map, not a Redis client; queries are fast and paginated.
- Impact: no shared cache; fine at current scale.

### Stub: dosage calculator uses a generic 15 mg/kg estimate (not per-drug pharmacology)
- Reason: no per-medicine dosing dataset; labeled clearly as illustrative + "consult a doctor".

## Batch 21A: Professionals + Hospitals (Migrations + Seed)

### ✅ Completed
- Migration 0111 applied: 14 tables (professionals, credentials, professional_badges, badge_definitions, endorsements, professional_reviews, professional_availability, hospitals, hospital_departments, hospital_services, hospital_facilities, hospital_staff, hospital_beds_availability, hospital_reviews, hospital_admins)
- 10 professionals seeded (doctors, nurses, pharmacists, etc.)
- 5 hospitals seeded (AIMS, Medical College, VPS, Sunrise, Medcare)
- Credentials, departments, bed availability synced
- Tables verified on VPS (commit 654fc1a)

## Batch 21B: Professionals + Hospitals (Pages + APIs)

### ✅ Completed (commit 7cdf068)
- **Libraries:** professionals.js (listProfs, searchProfs, getProf, getProfCredentials, getProfReviews, addReview, getProfBadges, trendingProfs, topRatedProfs, availability), hospitals.js extensions (listHosps, searchHosps, getHosp, getHospDepts, getHospServices, getHospFacilities, getBedAvailability, updateBedAvailability, getHospStaff, getHospReviews, addReview, getHospAdmins)
- **Schemas:** batch21.js (Professional, Hospital, Credential, Review, Endorsement, Availability, Badge, Department, Service, Facility, BedAvailability, SearchQuery)
- **Pages:** /professionals, /professionals/[id], /professionals/search, /hospitals, /hospitals/[id], /hospitals/search (6 real pages)
- **Components:** ProfCard, ProfDetail, HospCard, HospDetail (4 reusable, with variants in /components and /apps/web/components)
- **APIs:** /api/professionals, /api/professionals/search, /api/professionals/[id], /api/professionals/[id]/credentials, /api/professionals/[id]/reviews, /api/professionals/[id]/availability, /api/professionals/trending, /api/hospitals, /api/hospitals/search, /api/hospitals/[id], /api/hospitals/[id]/bed-availability, /api/hospitals/[id]/departments (12 core APIs verified in .next/server build output)
- **Build:** 143 static pages compiled successfully

### Assumptions
- File structure: Created libraries in both /lib (root) and /apps/web/lib (app-specific imports); components in both /components and /apps/web/components for flexibility
- Import resolution: @/lib/* resolves to /apps/web/lib/* per Next.js tsconfig paths
- Windows symlink issue (EPERM during standalone finalization) is non-blocking — code compiled; will resolve on Linux deploy

### Deferred
- Full 40+ API endpoint suite (specification lists 40+, 12 core compiled; remainder follows same pattern)
- Hospital admin endpoints (create/update/delete) — listed but not implemented
- Specialty/district filtering endpoints — functions exist in libraries, routes deferred
- WebSocket for real-time bed availability — polling-based (30s refresh) sufficient for MVP

## Deployment: Redis Port Fix + Git Sync (Pending VPS Execution)

### Issue 1: Redis port conflict
- docker-mm-redis-1 trying to bind 127.0.0.1:6379, but lsn-redis already owns it
- Solution: Change MalayaliMed redis to 127.0.0.1:6380

### Issue 2: Git divergence
- Local has commits (redis fix, deployment scripts)
- Remote has Batch 21A/21B code
- Need to sync both directions (pull remote, push local)

### Status
- **Scripts created:** 
  - `infra/scripts/fix-redis-port.sh` (redis fix)
  - `infra/scripts/git-sync.sh` (git sync)
- **Blocker:** VPS srv1778407 not reachable from this environment (no SSH access)
- **Action:** Run on VPS as `root@srv1778407:/opt/malayalimed$ bash infra/scripts/[script].sh`

### Scripts do:
**fix-redis-port.sh:**
1. Update docker-compose.prod.yml: 6379→6380
2. Stop/restart mm-redis on new port
3. Verify containers running
4. Test admin panel (optional)

**git-sync.sh:**
1. Fetch from origin/main
2. Pull remote changes
3. Resolve any conflicts (take remote as source of truth)
4. Push local commits
5. Verify full sync (local == remote)
6. Test website + containers

### Execution order:
1. `bash infra/scripts/fix-redis-port.sh` (fixes redis + git status)
2. `bash infra/scripts/git-sync.sh` (syncs git + verifies app)

### Expected outcome after execution:
- ✅ Redis on 127.0.0.1:6380
- ✅ Git: local == remote (fully synced)
- ✅ All containers healthy
- ✅ Website responding
- ✅ Ready for Batch 21C deployment
