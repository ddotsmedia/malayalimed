// feed.js — health content feed (articles + wellness), newest first, paginated.
import { safeQuery } from '@mm/db';

export function feedPage({ page = 1, limit = 10 } = {}) {
  const offset = (Math.max(1, page) - 1) * limit;
  return safeQuery(`
    SELECT * FROM (
      SELECT 'article' AS type, slug, title_en AS title, excerpt_en AS excerpt, category, published_at AS created_at
        FROM articles WHERE deleted_at IS NULL AND status='published'
      UNION ALL
      SELECT 'wellness' AS type, slug, title_en AS title, left(coalesce(body_en,''),160) AS excerpt, coalesce(category,'wellness') AS category, created_at
        FROM wellness_topics WHERE deleted_at IS NULL
    ) feed
    ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [limit, offset]);
}
