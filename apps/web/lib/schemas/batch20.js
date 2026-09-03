import { z } from 'zod';
export const ThreadSchema = z.object({ thread_type: z.enum(['patient_question', 'professional_case', 'general', 'hospital_ops']), title: z.string().min(5).max(300), content: z.string().min(10), is_anonymous: z.boolean().default(false) });
export const GroupSchema = z.object({ name: z.string().min(3).max(300), type: z.enum(['support', 'specialty', 'hospital', 'regional', 'interest']), description: z.string().optional(), is_private: z.boolean().default(false) });
export const ChatSchema = z.object({ message: z.string().min(1).max(1000) });
export const PostSchema = z.object({ content: z.string().min(1).max(5000) });
export function parse(schema, input) { const r = schema.safeParse(input); return r.success ? { ok: true, data: r.data } : { ok: false, error: `${r.error.issues[0].path.join('.')}: ${r.error.issues[0].message}` }; }
