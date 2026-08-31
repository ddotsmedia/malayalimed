// bulkImport.js — CSV parse + validated insert for providers. Admin only.
import { getPool, safeQuery, one } from '@mm/db';

export const ENTITY_TYPES = ['doctors', 'hospitals', 'pharmacies'];

// Minimal RFC-ish CSV parser (quoted fields, escaped quotes, CRLF tolerant).
export function parseCsv(text) {
  const rows = []; let field = ''; let row = []; let inQ = false;
  const s = String(text).replace(/\r\n?/g, '\n');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQ) {
      if (c === '"') { if (s[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const header = rows[0].map((h) => h.trim());
  return rows.slice(1).filter((r) => r.some((v) => v.trim() !== ''))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
}

const slugify = (str) => String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100) || 'item';
const bool = (v) => /^(1|true|yes|y|24x7)$/i.test(String(v || '').trim());

async function refMaps() {
  const [dist, spec] = await Promise.all([
    safeQuery('SELECT id, lower(name_en) AS n FROM districts WHERE deleted_at IS NULL'),
    safeQuery('SELECT id, lower(name_en) AS n FROM specialties WHERE deleted_at IS NULL'),
  ]);
  return {
    district: Object.fromEntries(dist.map((d) => [d.n, d.id])),
    specialty: Object.fromEntries(spec.map((s) => [s.n, s.id])),
  };
}

const CONFIG = {
  doctors: {
    table: 'doctors',
    required: ['display_name'],
    build: (r, m) => ({
      slug: slugify(r.display_name) + '-' + slugify(r.reg_no || Math.random().toString(36).slice(2, 6)),
      display_name: r.display_name,
      reg_no: r.reg_no || null,
      specialty_id: m.specialty[String(r.specialty_name || '').toLowerCase()] || null,
      district_id: m.district[String(r.district_name || '').toLowerCase()] || null,
      years_experience: r.experience ? parseInt(r.experience, 10) : null,
      consultation_fee: r.consultation_fee ? parseInt(r.consultation_fee, 10) : null,
      about_en: r.about_en || null,
      verification_status: 'pending',
    }),
  },
  hospitals: {
    table: 'hospitals',
    required: ['name_en'],
    build: (r, m) => ({
      slug: slugify(r.name_en),
      name_en: r.name_en,
      name_ml: r.name_ml || r.name_en,
      district_id: m.district[String(r.district_name || '').toLowerCase()] || null,
      bed_count: r.bed_count ? parseInt(r.bed_count, 10) : null,
      phone: r.phone || null,
      address_en: r.address_en || null,
      verification_status: 'pending',
    }),
  },
  pharmacies: {
    table: 'pharmacies',
    required: ['name'],
    build: (r, m) => ({
      slug: slugify(r.name),
      name: r.name,
      district_id: m.district[String(r.district_name || '').toLowerCase()] || null,
      phone: r.phone || null,
      address: r.address || null,
      is_24x7: bool(r['24x7_flag']),
      home_delivery: bool(r.delivery_flag),
    }),
  },
};

export async function runImport(adminId, entityType, fileName, csvText) {
  const cfg = CONFIG[entityType];
  if (!cfg) return { error: 'bad_entity' };
  const rows = parseCsv(csvText);
  const maps = await refMaps();
  const errors = []; let success = 0;
  const pool = getPool();

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const missing = cfg.required.find((c) => !r[c] || !String(r[c]).trim());
    if (missing) { errors.push({ row: i + 2, error: `missing ${missing}` }); continue; }
    const rec = cfg.build(r, maps);
    const cols = Object.keys(rec);
    const ph = cols.map((_, k) => `$${k + 1}`);
    try {
      const res = await pool.query(
        `INSERT INTO ${cfg.table} (${cols.join(',')}) VALUES (${ph.join(',')}) ON CONFLICT (slug) DO NOTHING`,
        cols.map((c) => rec[c]));
      if (res.rowCount > 0) success++;
      else errors.push({ row: i + 2, error: 'duplicate (slug exists)' });
    } catch (err) { errors.push({ row: i + 2, error: err.message.slice(0, 200) }); }
  }

  const { rows: ins } = await pool.query(
    `INSERT INTO bulk_imports (admin_id, entity_type, file_name, rows_total, rows_success, rows_failed, error_log, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,'completed') RETURNING id`,
    [adminId, entityType, fileName || null, rows.length, success, rows.length - success, JSON.stringify(errors)]);
  return { importId: ins[0].id, rowsTotal: rows.length, rowsSuccess: success, rowsFailed: rows.length - success, errors };
}

export function listImports() {
  return safeQuery(`SELECT b.id, b.entity_type, b.file_name, b.rows_total, b.rows_success, b.rows_failed, b.status, b.created_at, u.email AS admin_email
    FROM bulk_imports b LEFT JOIN users u ON u.id=b.admin_id ORDER BY b.created_at DESC LIMIT 100`);
}

export function getImport(id) {
  return one('SELECT * FROM bulk_imports WHERE id=$1', [id]);
}
