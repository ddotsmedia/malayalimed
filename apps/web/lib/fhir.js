// fhir — minimal FHIR R4 resource builders (package-free, plain objects).

export function toPractitioner(d) {
  const [given, ...family] = String(d.full_name || d.name || '').split(' ');
  return {
    resourceType: 'Practitioner',
    id: d.id,
    active: d.status === 'active' || d.verified === true,
    name: [{ use: 'official', text: d.full_name || d.name, given: [given], family: family.join(' ') || undefined }],
    qualification: d.qualification ? [{ code: { text: d.qualification } }] : undefined,
    telecom: d.phone ? [{ system: 'phone', value: d.phone }] : undefined,
  };
}

export function toOrganization(h) {
  return {
    resourceType: 'Organization',
    id: h.id,
    active: h.deleted_at == null,
    type: [{ text: h.type || 'Hospital' }],
    name: h.name,
    address: [{ text: h.address, city: h.district_name || h.district, country: 'IN' }],
    telecom: h.phone ? [{ system: 'phone', value: h.phone }] : undefined,
  };
}

export function toAppointment(a) {
  const map = { pending: 'pending', confirmed: 'booked', cancelled: 'cancelled', completed: 'fulfilled' };
  return {
    resourceType: 'Appointment',
    id: a.id,
    status: map[a.status] || 'proposed',
    start: a.slot_start || a.scheduled_at,
    end: a.slot_end || undefined,
    participant: [
      { actor: { reference: `Patient/${a.patient_id}` }, status: 'accepted' },
      { actor: { reference: `Practitioner/${a.doctor_id}` }, status: 'accepted' },
    ],
  };
}

export function toObservation(rec) {
  return {
    resourceType: 'Observation',
    id: rec.id,
    status: 'final',
    code: { text: rec.record_type || rec.title },
    subject: { reference: `Patient/${rec.patient_id}` },
    effectiveDateTime: rec.created_at,
    valueString: rec.body || rec.notes || undefined,
  };
}

export function bundle(resources) {
  return {
    resourceType: 'Bundle',
    type: 'collection',
    total: resources.length,
    entry: resources.map((r) => ({ resource: r })),
  };
}
