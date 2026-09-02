import { z } from 'zod';
const uuid = z.string().uuid();
export const S = {
  job: z.object({ title: z.string().min(2).max(200), specialty: z.string().max(100).optional().nullable(), location: z.string().max(100).optional().nullable(), salaryMin: z.coerce.number().optional().nullable(), salaryMax: z.coerce.number().optional().nullable(), experienceLevel: z.string().max(50).optional().nullable(), jobType: z.string().max(50).optional().nullable(), remoteAllowed: z.boolean().optional(), description: z.string().max(8000).optional().nullable() }),
  apply: z.object({ coverNote: z.string().max(4000).optional().nullable(), resumeId: uuid.optional().nullable() }),
  status: z.object({ status: z.string().min(1).max(20) }),
  filter: z.object({ name: z.string().min(1).max(100), specialties: z.array(z.string()).optional(), salaryMin: z.coerce.number().optional().nullable(), salaryMax: z.coerce.number().optional().nullable(), remoteOnly: z.boolean().optional(), locations: z.array(z.string()).optional() }),
  alert: z.object({ filterId: uuid.optional().nullable(), frequency: z.enum(['daily', 'weekly', 'instant']).optional() }),
  resume: z.object({ title: z.string().min(1).max(100), templateId: uuid.optional().nullable(), fullName: z.string().max(100).optional().nullable(), email: z.string().max(100).optional().nullable(), phone: z.string().max(20).optional().nullable(), summary: z.string().max(4000).optional().nullable(), data: z.any().optional() }),
  candidate: z.object({ headline: z.string().max(200).optional().nullable(), summary: z.string().max(4000).optional().nullable(), specialties: z.array(z.string()).optional(), experienceYears: z.coerce.number().int().optional().nullable(), currentRole: z.string().max(100).optional().nullable(), skills: z.array(z.string()).optional(), visibility: z.enum(['public', 'private', 'recruiters']).optional() }),
  recruiter: z.object({ companyName: z.string().min(1).max(200), companySize: z.string().max(50).optional().nullable(), industry: z.string().max(100).optional().nullable(), description: z.string().max(4000).optional().nullable() }),
  interview: z.object({ proposedDate: z.string().min(4).max(20), proposedTime: z.string().max(10).optional().nullable(), durationMinutes: z.coerce.number().int().optional().nullable() }),
  offer: z.object({ offerText: z.string().max(8000).optional().nullable(), salaryOffered: z.coerce.number().optional().nullable() }),
};
export function parse(schema, input) {
  const r = schema.safeParse(input);
  if (r.success) return { ok: true, data: r.data };
  const i = r.error.issues[0];
  return { ok: false, error: `${i.path.join('.') || 'field'}: ${i.message}` };
}
