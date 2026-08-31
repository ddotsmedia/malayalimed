// admin.js — Zod schemas for admin forms/mutations.
import { z } from 'zod';

export const doctorSchema = z.object({
  display_name: z.string().min(2).max(120),
  specialty_id: z.string().uuid().optional().nullable(),
  district_id: z.string().uuid().optional().nullable(),
  reg_no: z.string().max(60).optional().nullable(),
  consultation_fee: z.coerce.number().int().min(0).max(1000000).optional().nullable(),
  years_experience: z.coerce.number().int().min(0).max(80).optional().nullable(),
  bio: z.string().max(4000).optional().nullable(),
});

export const hospitalSchema = z.object({
  name_en: z.string().min(2).max(160),
  district_id: z.string().uuid().optional().nullable(),
  type: z.string().max(60).optional().nullable(),
  bed_count: z.coerce.number().int().min(0).max(20000).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  about_en: z.string().max(4000).optional().nullable(),
});

export const verifySchema = z.object({
  status: z.enum(['verified', 'rejected', 'pending']),
  reason: z.string().max(500).optional().nullable(),
});

export const appointmentSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
  notes: z.string().max(2000).optional().nullable(),
});

export const reviewModerationSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'flagged']),
  reason: z.string().max(500).optional().nullable(),
});

export const userSchema = z.object({
  role: z.enum(['patient', 'doctor', 'hospital_admin', 'content_editor', 'verification_agent', 'platform_admin']).optional(),
  status: z.enum(['active', 'inactive', 'banned']).optional(),
});

/** Returns {ok:true,data} or {ok:false,error} — flattened first message. */
export function parse(schema, input) {
  const r = schema.safeParse(input);
  if (r.success) return { ok: true, data: r.data };
  const i = r.error.issues[0];
  return { ok: false, error: `${i.path.join('.') || 'field'}: ${i.message}` };
}
