import { z } from 'zod';
const uuid = z.string().uuid();
export const S = {
  scribeStart: z.object({ appointmentId: uuid.optional().nullable(), audioUrl: z.string().max(2_000_000).optional().nullable(), transcription: z.string().max(20000).optional().nullable() }),
  scribeNotes: z.object({ notesFinal: z.string().max(20000) }),
  template: z.object({ templateName: z.string().min(1).max(100), sectionTypes: z.array(z.string().max(50)).max(20).optional() }),
  device: z.object({ deviceType: z.string().min(1).max(50), deviceName: z.string().max(100).optional().nullable() }),
  reading: z.object({ metricType: z.string().min(1).max(50), value: z.coerce.number(), unit: z.string().max(20).optional().nullable() }),
  thresholds: z.object({ thresholdLow: z.coerce.number().optional().nullable(), thresholdHigh: z.coerce.number().optional().nullable() }),
  condition: z.object({ conditionName: z.string().min(1).max(100), icd10Code: z.string().max(10).optional().nullable(), diagnosisDate: z.string().max(20).optional().nullable() }),
  medication: z.object({ medicationName: z.string().min(1).max(100), dosage: z.string().max(50).optional().nullable(), frequency: z.string().max(50).optional().nullable() }),
  insurance: z.object({ insurerName: z.string().min(1).max(100), policyNumber: z.string().max(100).optional().nullable(), planName: z.string().max(100).optional().nullable(), copay: z.coerce.number().optional().nullable(), deductible: z.coerce.number().optional().nullable(), coverageLimit: z.coerce.number().optional().nullable() }),
  priorAuth: z.object({ patientId: uuid, serviceType: z.string().min(1).max(100) }),
  orderDelivery: z.object({ deliveryAddress: z.string().min(1).max(500) }),
  subscribe: z.object({ subscriptionType: z.string().max(20), autoRefill: z.boolean().optional() }),
  diagnose: z.object({ symptoms: z.array(z.string().max(60)).min(1).max(12), encounterId: uuid.optional().nullable() }),
  bookTherapy: z.object({ therapistId: uuid, sessionType: z.string().max(50).optional().nullable(), nextSessionDate: z.string().max(20).optional().nullable() }),
};
export function parse(schema, input) {
  const r = schema.safeParse(input);
  if (r.success) return { ok: true, data: r.data };
  const i = r.error.issues[0];
  return { ok: false, error: `${i.path.join('.') || 'field'}: ${i.message}` };
}
