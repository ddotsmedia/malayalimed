// formatters.js — pure display helpers.
export const fmtDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
export const fmtTime = (t) => String(t || '').slice(0, 5);
export const fmtCurrency = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
export const fmtRating = (n) => (Number(n) > 0 ? Number(n).toFixed(1) : '—');
export const pluralize = (n, one, many) => `${n} ${n === 1 ? one : many}`;
export const initials = (name) => String(name || '?').split(/\s+/).slice(0, 2).map((s) => s[0] || '').join('').toUpperCase();
