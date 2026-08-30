// sql.js — parameterised query helpers. Never interpolate user input into SQL.
import { getPool } from './pool.js';

/** Run a parameterised query, return all rows. */
export async function query(text, values = []) {
  const { rows } = await getPool().query(text, values);
  return rows;
}

/** Run a query, return the first row or null. */
export async function one(text, values = []) {
  const rows = await query(text, values);
  return rows[0] || null;
}

/** Fail-soft query — logs and returns [] on error (for read paths). */
export async function safeQuery(text, values = []) {
  try { return await query(text, values); }
  catch (err) { console.error(`query failed: ${err.message}`); return []; }
}
