# MalayaliMed — Feature Port Plan (from kerala-healthcare-platform)

Analysis of the old platform (`/tmp/khp-old`, 142 migrations, ~120 pages) and a
ranked plan for porting its best features into MalayaliMed. Old code is **adapted**,
not copied verbatim — the schemas differ (old uses `@khp/*` + 142 migrations; MM
uses `@mm/*` + a lean core), so we re-implement each feature against MM's schema.

## Feature inventory (old platform)
| Feature | Old pages | Old libs | Old tables |
|---|---|---|---|
| Appointments | book, patient/appointments, consult/[room] | appointments, appointmentNotify | 0020 appointments, 0067 video, 0118 waitlist |
| Doctor schedules | portal/schedule (availability, opd) | — | 0018/0019 availability, 0057 opd |
| Health records | patient/{health-records,prescriptions,lab-reports,family} | prescriptions, labReports, healthMetrics | 0037 health_records, 0061/0129 prescriptions, 0062/0132 lab_reports |
| **Q&A** | ask, ask/new, ask/[slug] | qa, qaSafety | 0072 qa_questions, 0073 qa_answers, 0074 moderation |
| Resume builder | candidate/resume | resume, resumeRender | 0041 resume_profiles |
| **Lab tests** | lab-tests, lab-tests/[slug] | labTests, labMarkers | 0045 lab_tests, 0087 lab_test_guides |
| Advanced search | doctors (filters) | search builders | tsvector cols |

## Priority ranking & port decision
1. **Appointments** — MM already has book/list/video (lib/appointments.js). ➜ keep; enhance later.
2. **Doctor schedules & availability** — MM has `doctor_availability` (0009) but no slot generation. ➜ future.
3. **Health records (prescriptions, lab reports, history)** — ✅ **PORT** (patient value, self-contained).
4. **Q&A (ask doctors)** — ✅ **PORT** (engagement, SEO, self-contained).
5. Resume builder — future (couples to a jobs/candidate module MM doesn't have yet).
6. **Lab test database & explanations** — ✅ **PORT** (SEO + patient education, no auth, standalone).
7. Advanced search — incremental (add specialty/district/mode already present).

## Porting the top 3 (this pass)

### A. Q&A  — migration `0021_qa.sql`
- Tables: `qa_questions` (slug, patient_id, title, body, specialty_id, is_anonymous, status, views) + `qa_answers` (question_id, doctor_id, body, is_accepted, status). Simplified from old (drop moderation table; status enum covers it).
- lib: `qa.js` — listPublished, getBySlug(+answers), createQuestion.
- Pages: `/ml/ask` (list), `/ml/ask/new` (ask form, session-gated), `/ml/ask/[slug]` (detail).
- API: `POST /api/qa/questions`.
- Safety: health disclaimer on every page; no diagnosis; "consult a doctor" note.

### B. Health records / prescriptions — migration `0022_health_records.sql`
- Table: `health_records` (user_id, record_type, title, description, record_date, doctor_name, hospital_name, tags). (`prescriptions` already exists at MM 0016.)
- lib: `healthRecords.js` — list(userId, type), add.
- Pages: `/ml/patient/health-records` (list + add), session-gated.
- API: `GET/POST /api/health-records`.

### C. Lab tests guide — migration `0023_lab_tests.sql`
- Table: `lab_tests_guide` (slug, name_en/ml, category, sample_type, fasting_required, preparation, about_en/ml, typical_price_inr). Standalone (drop old `lab_id`/`diagnostic_labs` dependency). Seeded with common tests.
- lib: `labTests.js` — list(search), getBySlug.
- Pages: `/ml/lab-tests` (searchable list), `/ml/lab-tests/[slug]` (explanation).

## Adaptation rules
- Imports `@khp/*` → `@mm/*`; `@/lib/...` unchanged. Malayalam-first (ml/en) via existing i18n.
- Additive migrations only, `IF NOT EXISTS`, seeds `ON CONFLICT DO NOTHING`.
- Reuse MM components (SearchBar, EmptyState, HealthHub disclaimer pattern).
- Deploy via the same build → migrate (host `127.0.0.1:5432`) → recreate `mm-web` flow.
