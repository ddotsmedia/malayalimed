// migrate.js — applies pending SQL migrations in order, tracked in schema_migrations.
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { getPool } from './pool.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIR = join(HERE, 'migrations');

export async function migrate() {
  const pool = getPool();
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`);
  const applied = new Set((await pool.query('SELECT name FROM schema_migrations')).rows.map((r) => r.name));
  const files = readdirSync(DIR).filter((f) => f.endsWith('.sql')).sort();
  const done = [];
  for (const f of files) {
    if (applied.has(f)) continue;
    const sql = readFileSync(join(DIR, f), 'utf8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations(name) VALUES ($1)', [f]);
      await client.query('COMMIT');
      done.push(f);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`migration ${f} FAILED: ${err.message}`);
      throw err;
    } finally { client.release(); }
  }
  if (done.length) console.log(`Applied ${done.length} migration(s):\n  ${done.join('\n  ')}`);
  else console.log('No pending migrations. Schema up to date.');
  return done;
}

if (process.argv[1] && process.argv[1].endsWith('migrate.js')) {
  migrate().then(() => process.exit(0)).catch(() => process.exit(1));
}
