import { getPool, safeQuery, one } from '@mm/db';

export function threads(userId) {
  return safeQuery(`SELECT other.id AS user_id, other.full_name, max(m.created_at) AS last_at,
      count(*) FILTER (WHERE m.receiver_id=$1 AND m.read_at IS NULL)::int AS unread
    FROM messages m JOIN users other ON other.id = CASE WHEN m.sender_id=$1 THEN m.receiver_id ELSE m.sender_id END
    WHERE m.sender_id=$1 OR m.receiver_id=$1 GROUP BY other.id, other.full_name ORDER BY last_at DESC`, [userId]);
}
export function conversation(userId, otherId) {
  return safeQuery(`SELECT id, sender_id, receiver_id, message_text, read_at, created_at
    FROM messages WHERE (sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1) ORDER BY created_at ASC LIMIT 200`, [userId, otherId]);
}
export async function sendMessage(senderId, receiverId, text) {
  const { rows } = await getPool().query('INSERT INTO messages (sender_id, receiver_id, message_text) VALUES ($1,$2,$3) RETURNING id', [senderId, receiverId, text]);
  return { id: rows[0].id };
}
export async function markRead(id, userId) {
  await getPool().query('UPDATE messages SET read_at=now() WHERE id=$1 AND receiver_id=$2', [id, userId]);
  return { ok: true };
}
export async function deleteMessage(id, userId) {
  const { rowCount } = await getPool().query('DELETE FROM messages WHERE id=$1 AND sender_id=$2', [id, userId]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found' };
}
export async function startCall(patientId, doctorId) {
  const { rows } = await getPool().query('INSERT INTO voice_calls (patient_id, doctor_id) VALUES ($1,$2) RETURNING id', [patientId, doctorId]);
  return { callId: rows[0].id, room: 'mm-call-' + rows[0].id };
}
export function otherUser(id) { return one('SELECT id, full_name FROM users WHERE id=$1', [id]); }
