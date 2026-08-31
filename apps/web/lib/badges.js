// badges.js — evaluate + persist patient achievements (server).
import { getPool, safeQuery } from '@mm/db';
import { BADGES, BADGE_ORDER } from './badgeDefs.js';

export { BADGES, BADGE_ORDER };

// Conditions are evaluated from real activity tables (fail-soft).
const CHECKS = {
  first_appointment: 'SELECT 1 FROM appointments WHERE patient_id=$1 AND deleted_at IS NULL LIMIT 1',
  consultation_completed: "SELECT 1 FROM appointments WHERE patient_id=$1 AND status='completed' AND deleted_at IS NULL LIMIT 1",
  prescription_uploaded: 'SELECT 1 FROM prescriptions WHERE patient_id=$1 AND deleted_at IS NULL LIMIT 1',
  review_posted: 'SELECT 1 FROM reviews WHERE patient_id=$1 AND deleted_at IS NULL LIMIT 1',
  qa_answered: 'SELECT 1 FROM qa_questions WHERE patient_id=$1 AND deleted_at IS NULL LIMIT 1',
  // health_streak_7 uses a grouped query handled explicitly in evaluateBadges.
};

/** Evaluate all badges for a user, insert any newly earned. Returns array of newly-unlocked badge_types. */
export async function evaluateBadges(userId) {
  if (!userId) return [];
  const pool = getPool();
  const newlyUnlocked = [];
  for (const type of BADGE_ORDER) {
    try {
      const q = CHECKS[type];
      const { rows } = await pool.query(type === 'health_streak_7'
        ? 'SELECT 1 FROM health_metrics WHERE patient_id=$1 GROUP BY patient_id HAVING count(DISTINCT recorded_date) >= 7'
        : q, [userId]);
      if (rows.length) {
        const ins = await pool.query('INSERT INTO achievements (patient_id, badge_type) VALUES ($1,$2) ON CONFLICT (patient_id, badge_type) DO NOTHING RETURNING id', [userId, type]);
        if (ins.rowCount > 0) newlyUnlocked.push(type);
      }
    } catch { /* skip a badge whose source table is unavailable */ }
  }
  return newlyUnlocked;
}

export async function listAchievements(userId) {
  await evaluateBadges(userId);
  const unlocked = await safeQuery('SELECT badge_type, unlocked_at FROM achievements WHERE patient_id=$1', [userId]);
  const map = Object.fromEntries(unlocked.map((u) => [u.badge_type, u.unlocked_at]));
  const badges = BADGE_ORDER.map((type) => ({ type, ...BADGES[type], unlocked: !!map[type], unlockedAt: map[type] || null }));
  const next = badges.find((b) => !b.unlocked);
  return { badges, unlockedCount: unlocked.length, total: BADGE_ORDER.length, nextMilestone: next || null };
}
