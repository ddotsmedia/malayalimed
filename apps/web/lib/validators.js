// validators.js — input validation (pure).
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || ''));
export const isMobile = (v) => /^(\+?91)?[6-9]\d{9}$/.test(String(v || '').replace(/\s/g, ''));
export const isStrongPassword = (v) => String(v || '').length >= 8;
export const nonEmpty = (v) => String(v || '').trim().length > 0;
export const inRange = (n, lo, hi) => Number.isFinite(+n) && +n >= lo && +n <= hi;
export function validate(fields, rules) {
  const errors = {};
  for (const [key, checks] of Object.entries(rules)) {
    for (const [name, fn] of Object.entries(checks)) {
      if (!fn(fields[key])) { errors[key] = name; break; }
    }
  }
  return { ok: Object.keys(errors).length === 0, errors };
}
