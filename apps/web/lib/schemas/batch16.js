import { z } from 'zod';
const uuid = z.string().uuid();
export const S = {
  reschedule: z.object({ appointmentId: uuid, newDate: z.string().min(4).max(20) }),
  cancel: z.object({ appointmentId: uuid }),
  waitlist: z.object({ doctorId: uuid, appointmentId: uuid.optional().nullable() }),
  message: z.object({ text: z.string().min(1).max(4000) }),
  post: z.object({ title: z.string().min(2).max(200), content: z.string().min(1).max(8000), category: z.string().max(50).optional().nullable() }),
  comment: z.object({ comment: z.string().min(1).max(2000) }),
  goal: z.object({ goalName: z.string().min(1).max(200), targetValue: z.coerce.number().optional().nullable(), currentValue: z.coerce.number().optional().nullable(), dueDate: z.string().max(20).optional().nullable() }),
  goalUpdate: z.object({ currentValue: z.coerce.number() }),
  cert: z.object({ certName: z.string().min(1).max(200), issuingBody: z.string().max(200).optional().nullable(), issueDate: z.string().max(20).optional().nullable(), expiryDate: z.string().max(20).optional().nullable() }),
  followUp: z.object({ appointmentId: uuid.optional().nullable(), followUpDate: z.string().min(4).max(20), notes: z.string().max(1000).optional().nullable() }),
  referralShare: z.object({ email: z.string().email().optional().nullable() }),
  support: z.object({ kind: z.enum(['contact', 'feedback']), name: z.string().max(120).optional().nullable(), email: z.string().email().optional().nullable(), message: z.string().min(1).max(4000) }),
  rate: z.object({ articleId: uuid, rating: z.coerce.number().int().min(1).max(5) }),
};
export function parse(schema, input) {
  const r = schema.safeParse(input);
  if (r.success) return { ok: true, data: r.data };
  const i = r.error.issues[0];
  return { ok: false, error: `${i.path.join('.') || 'field'}: ${i.message}` };
}
