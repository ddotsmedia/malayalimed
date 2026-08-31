// adminContent.js — generic, SAFE admin CRUD for directory content. Table and
// column names come ONLY from this hardcoded REGISTRY (never user input); all
// values are parameterised. Arrays are entered comma-separated.
import { getPool, safeQuery } from '@mm/db';

const F = (name, type = 'text', opts = {}) => ({ name, type, ...opts });

export const REGISTRY = {
  diseases: { label: 'Diseases', table: 'diseases',
    list: ['name_en', 'category'],
    fields: [F('slug', 'text', { req: true }), F('name_en', 'text', { req: true }), F('name_ml'), F('category'), F('overview_en', 'textarea'), F('symptoms_en', 'textarea'), F('prevention_en', 'textarea'), F('specialty_slug')] },
  symptoms: { label: 'Symptoms', table: 'symptoms',
    list: ['name_en', 'urgency'],
    fields: [F('slug', 'text', { req: true }), F('name_en', 'text', { req: true }), F('name_ml'), F('body_area'), F('urgency'), F('advice_en', 'textarea')] },
  medicines: { label: 'Medicines', table: 'medicines',
    list: ['name', 'category'],
    fields: [F('slug', 'text', { req: true }), F('name', 'text', { req: true }), F('generic_name'), F('form'), F('category'), F('uses_en', 'textarea'), F('side_effects_en', 'textarea'), F('prescription_required', 'bool')] },
  procedures: { label: 'Procedures', table: 'procedures',
    list: ['name_en', 'category'],
    fields: [F('slug', 'text', { req: true }), F('name_en', 'text', { req: true }), F('name_ml'), F('category'), F('specialty_slug'), F('about_en', 'textarea'), F('preparation_en', 'textarea'), F('recovery_en', 'textarea'), F('typical_cost_inr', 'number')] },
  articles: { label: 'Health News', table: 'articles',
    list: ['title_en', 'category'],
    fields: [F('slug', 'text', { req: true }), F('title_en', 'text', { req: true }), F('title_ml'), F('category'), F('excerpt_en', 'textarea'), F('body_en', 'textarea')] },
  wellness_topics: { label: 'Wellness', table: 'wellness_topics',
    list: ['title_en', 'category'],
    fields: [F('slug', 'text', { req: true }), F('title_en', 'text', { req: true }), F('title_ml'), F('category'), F('icon'), F('body_en', 'textarea')] },
  first_aid_guides: { label: 'First Aid', table: 'first_aid_guides',
    list: ['title_en'],
    fields: [F('slug', 'text', { req: true }), F('title_en', 'text', { req: true }), F('title_ml'), F('steps_en', 'textarea', { req: true }), F('call_help', 'bool')] },
  lab_tests_guide: { label: 'Lab Tests', table: 'lab_tests_guide',
    list: ['name_en', 'category'],
    fields: [F('slug', 'text', { req: true }), F('name_en', 'text', { req: true }), F('name_ml'), F('category'), F('sample_type'), F('fasting_required', 'bool'), F('preparation_en', 'textarea'), F('about_en', 'textarea'), F('typical_price_inr', 'number'), F('report_hours', 'number')] },
  blood_banks: { label: 'Blood Banks', table: 'blood_banks',
    list: ['name'],
    fields: [F('slug', 'text', { req: true }), F('name', 'text', { req: true }), F('phone'), F('address'), F('available_types', 'array'), F('is_24x7', 'bool')] },
  pharmacies: { label: 'Pharmacies', table: 'pharmacies',
    list: ['name'],
    fields: [F('slug', 'text', { req: true }), F('name', 'text', { req: true }), F('phone'), F('address'), F('is_24x7', 'bool'), F('home_delivery', 'bool')] },
  dental_clinics: { label: 'Dental Clinics', table: 'dental_clinics',
    list: ['name_en'],
    fields: [F('slug', 'text', { req: true }), F('name_en', 'text', { req: true }), F('name_ml'), F('address'), F('phone'), F('about_en', 'textarea'), F('services', 'array')] },
  eye_hospitals: { label: 'Eye Hospitals', table: 'eye_hospitals',
    list: ['name_en'],
    fields: [F('slug', 'text', { req: true }), F('name_en', 'text', { req: true }), F('name_ml'), F('address'), F('phone'), F('about_en', 'textarea'), F('services', 'array')] },
  mental_health_centres: { label: 'Mental Health Centres', table: 'mental_health_centres',
    list: ['name_en'],
    fields: [F('slug', 'text', { req: true }), F('name_en', 'text', { req: true }), F('name_ml'), F('address'), F('phone'), F('about_en', 'textarea'), F('services', 'array'), F('crisis_phone')] }
};

export const resourceDef = (key) => REGISTRY[key] || null;

const coerce = (field, raw) => {
  if (field.type === 'bool') return raw === true || raw === 'true' || raw === 'on';
  if (field.type === 'number') { const n = parseInt(raw, 10); return Number.isFinite(n) ? n : null; }
  if (field.type === 'array') return String(raw || '').split(',').map((s) => s.trim()).filter(Boolean);
  const v = String(raw ?? '').trim(); return v === '' ? null : v.slice(0, 4000);
};

export function listContent(key) {
  const def = resourceDef(key); if (!def) return Promise.resolve([]);
  const cols = ['id', 'slug', ...def.list, 'created_at'].filter((c, i, a) => a.indexOf(c) === i);
  return safeQuery(`SELECT ${cols.join(', ')} FROM ${def.table} WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 500`);
}

export async function createContent(key, data) {
  const def = resourceDef(key); if (!def) return { error: 'bad_resource' };
  const cols = []; const vals = []; const ph = [];
  for (const f of def.fields) {
    if (f.req && (data[f.name] == null || String(data[f.name]).trim() === '')) return { error: `${f.name}_required` };
    if (data[f.name] === undefined) continue;
    cols.push(f.name); vals.push(coerce(f, data[f.name])); ph.push(`$${vals.length}${f.type === 'array' ? '::text[]' : ''}`);
  }
  try {
    const { rows } = await getPool().query(`INSERT INTO ${def.table} (${cols.join(',')}) VALUES (${ph.join(',')}) RETURNING id`, vals);
    return { id: rows[0].id };
  } catch (err) { return { error: err.message.includes('unique') ? 'slug_taken' : err.message }; }
}

export async function deleteContent(key, id) {
  const def = resourceDef(key); if (!def) return { error: 'bad_resource' };
  const { rowCount } = await getPool().query(`UPDATE ${def.table} SET deleted_at=now() WHERE id=$1 AND deleted_at IS NULL`, [id]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found' };
}
