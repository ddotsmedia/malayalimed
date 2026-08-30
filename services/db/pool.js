// pool.js — shared PostgreSQL connection pool (singleton).
import pg from 'pg';

const { Pool } = pg;
let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgres://mm:mm@127.0.0.1:5432/malayalimed',
      max: Number(process.env.PG_POOL_MAX || 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });
    pool.on('error', (err) => console.error(`pg pool error: ${err.message}`));
  }
  return pool;
}
