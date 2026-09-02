import { z } from 'zod';
export const sideEffectSchema = z.object({ sideEffect: z.string().min(1).max(200), severity: z.enum(['mild', 'moderate', 'severe']).optional(), durationDays: z.coerce.number().int().optional().nullable() });
export const reviewSchema = z.object({ rating: z.coerce.number().int().min(1).max(5), reviewText: z.string().max(4000).optional().nullable(), effectivenessRating: z.coerce.number().int().min(1).max(5).optional().nullable(), sideEffectSeverity: z.coerce.number().int().min(1).max(5).optional().nullable() });
export function parse(schema, input) {
  const r = schema.safeParse(input);
  if (r.success) return { ok: true, data: r.data };
  const i = r.error.issues[0];
  return { ok: false, error: `${i.path.join('.') || 'field'}: ${i.message}` };
}
