// patient.js — Zod schemas for patient-facing mutations.
import { z } from 'zod';

export const metricSchema = z.object({
  metricType: z.enum(['weight', 'blood_pressure', 'blood_sugar', 'heart_rate', 'sleep_hours', 'steps', 'mood']),
  value: z.coerce.number().min(0).max(1000000),
  value2: z.coerce.number().min(0).max(1000).optional().nullable(),
  unit: z.string().max(20).optional().nullable(),
});

export const goalSchema = z.object({
  goalType: z.string().min(2).max(50),
  targetValue: z.coerce.number().min(0).max(1000000),
  unit: z.string().max(20).optional().nullable(),
});

export const prescriptionSchema = z.object({
  doctorId: z.string().uuid().optional().nullable(),
  prescriptionText: z.string().max(5000).optional().nullable(),
  medicines: z.array(z.string().max(200)).max(100).optional().nullable(),
  fileName: z.string().max(255).optional().nullable(),
}).refine((d) => d.prescriptionText || (d.medicines && d.medicines.length) || d.fileName, { message: 'provide text, medicines, or a file' });

export const doctorRegSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(8).max(20),
  displayName: z.string().min(2).max(255),
  regNo: z.string().min(2).max(100),
  specialtyId: z.string().uuid().optional().nullable(),
  districtId: z.string().uuid().optional().nullable(),
  yearsExperience: z.coerce.number().int().min(0).max(80).optional().nullable(),
  consultationFee: z.coerce.number().int().min(0).max(1000000).optional().nullable(),
  qualifications: z.array(z.string().max(200)).max(20).optional().nullable(),
  about: z.string().max(4000).optional().nullable(),
});

export function parse(schema, input) {
  const r = schema.safeParse(input);
  if (r.success) return { ok: true, data: r.data };
  const i = r.error.issues[0];
  return { ok: false, error: `${i.path.join('.') || 'field'}: ${i.message}` };
}
