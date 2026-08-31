import { getPool, safeQuery } from '@mm/db';
import { randomBytes } from 'node:crypto';

export function listReferrals(userId) {
  return safeQuery('SELECT id, referred_email, code, status, bonus_amount, created_at FROM referrals WHERE referrer_id=$1 ORDER BY created_at DESC', [userId]);
}
export async function createReferral(userId, email) {
  const code = randomBytes(4).toString('hex');
  const { rows } = await getPool().query('INSERT INTO referrals (referrer_id, referred_email, code, status) VALUES ($1,$2,$3,\'pending\') RETURNING id', [userId, email || null, code]);
  return { id: rows[0].id, code };
}
export function rewards(userId) {
  return safeQuery('SELECT id, reason, reward_points, created_at FROM referral_rewards WHERE user_id=$1 ORDER BY created_at DESC', [userId]);
}
export async function rewardTotal(userId) {
  const [r] = await safeQuery('SELECT coalesce(sum(reward_points),0)::int AS total FROM referral_rewards WHERE user_id=$1', [userId]);
  return r?.total || 0;
}
