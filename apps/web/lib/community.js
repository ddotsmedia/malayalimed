import { getPool, safeQuery, one } from '@mm/db';

export function listPosts({ page = 1, limit = 20 } = {}) {
  return safeQuery(`SELECT p.id, p.title, p.content, p.category, p.likes, p.created_at, u.full_name AS author
    FROM community_posts p LEFT JOIN users u ON u.id=p.user_id WHERE p.deleted_at IS NULL
    ORDER BY p.created_at DESC LIMIT $1 OFFSET $2`, [limit, (Math.max(1, page) - 1) * limit]);
}
export function getPost(id) {
  return one(`SELECT p.*, u.full_name AS author FROM community_posts p LEFT JOIN users u ON u.id=p.user_id WHERE p.id=$1 AND p.deleted_at IS NULL`, [id]);
}
export async function createPost(userId, { title, content, category }) {
  const { rows } = await getPool().query('INSERT INTO community_posts (user_id, title, content, category) VALUES ($1,$2,$3,$4) RETURNING id', [userId, title, content, category || 'general']);
  return { id: rows[0].id };
}
export function listComments(postId) {
  return safeQuery(`SELECT c.id, c.comment, c.created_at, u.full_name AS author FROM community_comments c LEFT JOIN users u ON u.id=c.user_id WHERE c.post_id=$1 ORDER BY c.created_at ASC`, [postId]);
}
export async function addComment(postId, userId, comment) {
  const { rows } = await getPool().query('INSERT INTO community_comments (post_id, user_id, comment) VALUES ($1,$2,$3) RETURNING id', [postId, userId, comment]);
  return { id: rows[0].id };
}
export async function like(postId, userId) {
  const r = await getPool().query('INSERT INTO community_likes (post_id, user_id) VALUES ($1,$2) ON CONFLICT (post_id, user_id) DO NOTHING', [postId, userId]);
  if (r.rowCount > 0) await getPool().query('UPDATE community_posts SET likes=likes+1 WHERE id=$1', [postId]);
  return { ok: true };
}
export async function unlike(postId, userId) {
  const r = await getPool().query('DELETE FROM community_likes WHERE post_id=$1 AND user_id=$2', [postId, userId]);
  if (r.rowCount > 0) await getPool().query('UPDATE community_posts SET likes=GREATEST(0,likes-1) WHERE id=$1', [postId]);
  return { ok: true };
}
