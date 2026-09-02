import { getPool, safeQuery, one } from '@mm/db';
const PAGE = 20;
const off = (p) => (Math.max(1, Number(p) || 1) - 1) * PAGE;

// ---- Medicines ----
export function listMeds(page) { return safeQuery('SELECT id, generic_name, brand_names, form, manufacturer, strength FROM med_library ORDER BY generic_name LIMIT $1 OFFSET $2', [PAGE, off(page)]); }
export function searchMeds(q) { return safeQuery(`SELECT id, generic_name, brand_names, form FROM med_library WHERE generic_name ILIKE $1 OR $2 = ANY(brand_names) ORDER BY generic_name LIMIT 30`, [`%${q}%`, q]); }
export function getMed(id) { return one('SELECT * FROM med_library WHERE id=$1', [id]); }
export function medForms() { return safeQuery('SELECT form, count(*)::int AS n FROM med_library WHERE form IS NOT NULL GROUP BY form ORDER BY n DESC'); }
export function medReviews(id) { return safeQuery('SELECT r.id, r.rating, r.review_text, r.effectiveness_rating, r.helpful_count, r.created_at, u.full_name FROM medicine_reviews r LEFT JOIN users u ON u.id=r.user_id WHERE r.medicine_id=$1 ORDER BY r.created_at DESC LIMIT 50', [id]); }
export async function medInteractions(id, withId) {
  if (withId) { const [r] = await safeQuery('SELECT severity, description FROM medicine_interactions WHERE (medicine1_id=$1 AND medicine2_id=$2) OR (medicine1_id=$2 AND medicine2_id=$1) LIMIT 1', [id, withId]); return r || { severity: 'none', description: 'No recorded interaction in our reference set. Always confirm with a pharmacist.' }; }
  return safeQuery('SELECT i.severity, i.description, m.generic_name FROM medicine_interactions i JOIN med_library m ON m.id=i.medicine2_id WHERE i.medicine1_id=$1', [id]);
}
export function medAlternatives(id) { return safeQuery('SELECT a.reason, m.id, m.generic_name, m.form FROM medicine_alternatives a JOIN med_library m ON m.id=a.alternative_id WHERE a.medicine_id=$1', [id]); }
export async function addReview(id, userId, b) { const { rows } = await getPool().query('INSERT INTO medicine_reviews (medicine_id, user_id, rating, review_text, effectiveness_rating, side_effect_severity) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id', [id, userId, b.rating, b.reviewText || null, b.effectivenessRating ?? null, b.sideEffectSeverity ?? null]); return { id: rows[0].id }; }
export async function addSideEffect(id, userId, b) { const { rows } = await getPool().query('INSERT INTO side_effect_reports (medicine_id, user_id, side_effect, severity, duration_days) VALUES ($1,$2,$3,$4,$5) RETURNING id', [id, userId, b.sideEffect, b.severity || 'mild', b.durationDays ?? null]); return { id: rows[0].id }; }
export async function dosageCalc(id, weight, age) {
  const med = await getMed(id); if (!med) return { error: 'not_found' };
  const w = Number(weight) || 0; const perKg = 15; // mg/kg default (paracetamol-like example)
  const dose = Math.round(w * perKg);
  return { medicine: med.generic_name, weight: w, age: Number(age) || null, estimatedDoseMg: dose, note: 'Illustrative weight-based estimate (15 mg/kg). Always follow the prescription and consult a doctor/pharmacist.' };
}

// ---- Lab tests ----
export function listTests(page) { return safeQuery('SELECT id, test_name, test_code, category, cost, at_home FROM lab_test_library ORDER BY test_name LIMIT $1 OFFSET $2', [PAGE, off(page)]); }
export function searchTests(q) { return safeQuery('SELECT id, test_name, test_code, category, cost FROM lab_test_library WHERE test_name ILIKE $1 OR test_code ILIKE $1 ORDER BY test_name LIMIT 30', [`%${q}%`]); }
export function getTest(id) { return one('SELECT * FROM lab_test_library WHERE id=$1', [id]); }
export function testsByCategory(name) { return safeQuery('SELECT id, test_name, test_code, cost FROM lab_test_library WHERE lower(category)=lower($1) ORDER BY test_name', [name]); }
export function atHomeTests() { return safeQuery('SELECT id, test_name, category, cost FROM lab_test_library WHERE at_home=true ORDER BY test_name', []); }
export function fastingTests() { return safeQuery("SELECT id, test_name, category, preparation_needed FROM lab_test_library WHERE preparation_needed ILIKE '%fasting%' ORDER BY test_name", []); }
export function trendingTests() { return safeQuery('SELECT id, test_name, category, cost FROM lab_test_library ORDER BY cost DESC LIMIT 12', []); }
export function testCosts(ids) { const list = String(ids || '').split(',').filter(Boolean); if (!list.length) return listTests(1); const ph = list.map((_, i) => `$${i + 1}`).join(','); return safeQuery(`SELECT id, test_name, cost FROM lab_test_library WHERE id IN (${ph})`, list); }
export async function interpretTest(id, value) {
  const t = await getTest(id); if (!t) return { error: 'not_found' };
  const v = Number(value); const range = t.normal_range_male || '';
  let status = 'unknown';
  const between = range.match(/^([\d.]+)\s*-\s*([\d.]+)$/);
  const less = range.match(/^<\s*([\d.]+)$/);
  if (Number.isFinite(v)) {
    if (between) status = v < +between[1] ? 'low' : v > +between[2] ? 'high' : 'normal';
    else if (less) status = v < +less[1] ? 'normal' : 'high';
  }
  return { test: t.test_name, value: v, unit: t.unit, normalRange: range, status, disclaimer: 'Educational interpretation only — discuss results with your doctor.' };
}

// ---- Procedures ----
export function listProcs(page) { return safeQuery('SELECT id, procedure_name, specialty, duration_minutes, success_rate, cost_range FROM proc_library ORDER BY procedure_name LIMIT $1 OFFSET $2', [PAGE, off(page)]); }
export function searchProcs(q) { return safeQuery('SELECT id, procedure_name, specialty, cost_range FROM proc_library WHERE procedure_name ILIKE $1 OR specialty ILIKE $1 ORDER BY procedure_name LIMIT 30', [`%${q}%`]); }
export async function getProc(id) {
  const p = await one('SELECT * FROM proc_library WHERE id=$1', [id]); if (!p) return null;
  const [steps, risks] = await Promise.all([safeQuery('SELECT step_num, step_description, duration_minutes FROM procedure_steps WHERE procedure_id=$1 ORDER BY step_num', [id]), safeQuery('SELECT risk, probability, severity FROM procedure_risks WHERE procedure_id=$1', [id])]);
  return { ...p, steps, risks };
}
export function procRisks(id) { return safeQuery('SELECT risk, probability, severity FROM procedure_risks WHERE procedure_id=$1', [id]); }
export function procsBySpecialty(spec) { return safeQuery('SELECT id, procedure_name, success_rate, cost_range FROM proc_library WHERE lower(specialty)=lower($1) ORDER BY procedure_name', [spec]); }
export function successRates() { return safeQuery('SELECT procedure_name, specialty, success_rate FROM proc_library WHERE success_rate IS NOT NULL ORDER BY success_rate DESC LIMIT 20', []); }
export function minimallyInvasive() { return safeQuery('SELECT id, procedure_name, specialty, recovery_time FROM proc_library WHERE minimally_invasive=true ORDER BY procedure_name', []); }

// ---- Conditions ----
export function listConditions(page) { return safeQuery('SELECT id, condition_name, slug, icd10_code, overview FROM condition_guides ORDER BY condition_name LIMIT $1 OFFSET $2', [PAGE, off(page)]); }
export function getCondition(slug) { return one('SELECT * FROM condition_guides WHERE slug=$1 OR lower(condition_name)=lower($1)', [slug]); }
export async function conditionMeds(slug) { const c = await getCondition(slug); if (!c) return []; return safeQuery('SELECT m.id, m.generic_name, m.form, cm.typical_dosage FROM condition_medicines cm JOIN med_library m ON m.id=cm.medicine_id WHERE cm.guide_id=$1', [c.id]); }
export async function conditionProcs(slug) { const c = await getCondition(slug); if (!c) return []; return safeQuery('SELECT p.id, p.procedure_name, p.specialty, cp.when_needed FROM condition_procedures cp JOIN proc_library p ON p.id=cp.procedure_id WHERE cp.guide_id=$1', [c.id]); }

// ---- Universal search ----
export function universalSearch(q, type) {
  const args = [`%${q}%`]; let where = '(title ILIKE $1 OR content ILIKE $1)';
  if (type) { args.push(type); where += ` AND entity_type=$${args.length}`; }
  return safeQuery(`SELECT entity_type, entity_id, title, category, relevance_score FROM search_indexing WHERE ${where} ORDER BY relevance_score DESC LIMIT 40`, args);
}
