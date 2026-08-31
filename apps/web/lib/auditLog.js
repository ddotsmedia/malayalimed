// auditLog.js — append-only admin action log (existing audit_logs table, 0018+0039).
import { getPool } from '@mm/db';

/**
 * Record an admin action. Fail-soft: never throws into the request path.
 * @param {object} p {actorId, action, entityType, entityId, oldValue, newValue, ip, ua}
 */
export async function audit({ actorId, action, entityType, entityId, oldValue, newValue, ip, ua }) {
  try {
    await getPool().query(
      `INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, old_value, new_value, ip_address, user_agent)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [actorId || null, action, entityType || null, entityId || null,
        oldValue ? JSON.stringify(oldValue) : null, newValue ? JSON.stringify(newValue) : null,
        ip || null, (ua || '').slice(0, 500) || null]);
  } catch { /* never block the action on a log failure */ }
}

// Pull ip + user-agent from a Next request for convenience.
export function reqMeta(request) {
  const h = request.headers;
  return { ip: (h.get('x-forwarded-for') || '').split(',')[0].trim() || null, ua: h.get('user-agent') || null };
}

export function listAuditLogs({ action, entityType, actorEmail, page = 1, limit = 50 } = {}) {
  const where = ['1=1']; const args = [];
  if (action) { args.push(action); where.push(`a.action=$${args.length}`); }
  if (entityType) { args.push(entityType); where.push(`a.entity_type=$${args.length}`); }
  if (actorEmail) { args.push(`%${actorEmail}%`); where.push(`u.email ILIKE $${args.length}`); }
  args.push(limit, (Math.max(1, page) - 1) * limit);
  return getPool().query(
    `SELECT a.id, a.action, a.entity_type, a.entity_id, a.old_value, a.new_value, a.ip_address, a.created_at,
       u.email AS actor_email
     FROM audit_logs a LEFT JOIN users u ON u.id=a.actor_id
     WHERE ${where.join(' AND ')}
     ORDER BY a.created_at DESC LIMIT $${args.length - 1} OFFSET $${args.length}`, args)
    .then((r) => r.rows).catch(() => []);
}
