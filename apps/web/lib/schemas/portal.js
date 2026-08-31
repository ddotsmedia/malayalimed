// portal.js — Zod schemas for billing/lab/pharmacy/doctor/hospital forms.
import { z } from 'zod';

export const invoiceSchema = z.object({
  patientId: z.string().uuid().optional().nullable(),
  doctorId: z.string().uuid().optional().nullable(),
  appointmentId: z.string().uuid().optional().nullable(),
  amount: z.coerce.number().min(0).max(10000000),
});
export const payBillSchema = z.object({
  invoiceId: z.string().uuid(),
  method: z.enum(['card', 'upi', 'netbanking', 'cash']).optional(),
});
export const inventoryTxSchema = z.object({
  inventoryId: z.string().uuid(),
  txType: z.enum(['add', 'remove', 'set']),
  qty: z.coerce.number().int().min(0).max(1000000),
  reason: z.string().max(100).optional().nullable(),
});
export const labUploadSchema = z.object({
  orderId: z.string().uuid(),
  testName: z.string().max(200).optional().nullable(),
  resultValue: z.string().max(200).optional().nullable(),
  normalRange: z.string().max(100).optional().nullable(),
  pdfUrl: z.string().max(2_000_000).optional().nullable(),
});
export const allergySchema = z.object({
  allergen: z.string().min(1).max(200),
  reaction: z.string().max(1000).optional().nullable(),
  severity: z.enum(['mild', 'moderate', 'severe']).optional(),
});
export const encounterSchema = z.object({
  appointmentId: z.string().uuid().optional().nullable(),
  patientId: z.string().uuid().optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
  diagnosis: z.string().max(2000).optional().nullable(),
  treatmentPlan: z.string().max(2000).optional().nullable(),
  followUpDate: z.string().max(20).optional().nullable(),
  prescriptions: z.array(z.object({
    medicineName: z.string().max(200), dosage: z.string().max(100).optional().nullable(),
    frequency: z.string().max(50).optional().nullable(), duration: z.coerce.number().int().optional().nullable(),
    instructions: z.string().max(500).optional().nullable(),
  })).max(30).optional(),
});
export const bedSchema = z.object({
  status: z.enum(['vacant', 'occupied', 'maintenance']),
  patientId: z.string().uuid().optional().nullable(),
});

export function parse(schema, input) {
  const r = schema.safeParse(input);
  if (r.success) return { ok: true, data: r.data };
  const i = r.error.issues[0];
  return { ok: false, error: `${i.path.join('.') || 'field'}: ${i.message}` };
}
