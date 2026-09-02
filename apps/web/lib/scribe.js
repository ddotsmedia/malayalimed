import { getPool, safeQuery, one } from '@mm/db';
import { askClaude } from './anthropic.js';

// Draft SOAP-style notes from a transcription (Claude if key set, else template).
async function draftNotes(transcription) {
  if (!transcription) return 'Subjective:\n\nObjective:\n\nAssessment:\n\nPlan:\n';
  const ai = await askClaude({ system: 'You are a medical scribe. Convert the visit transcript into concise SOAP notes (Subjective, Objective, Assessment, Plan). Do not invent facts.', user: transcription.slice(0, 6000), maxTokens: 600 });
  return ai || `Subjective:\n${transcription.slice(0, 500)}\n\nObjective:\n\nAssessment:\n\nPlan:\n`;
}

export async function startSession(doctorId, { appointmentId, audioUrl, transcription }) {
  const notes = await draftNotes(transcription);
  const { rows } = await getPool().query(
    'INSERT INTO scribe_sessions (doctor_id, appointment_id, audio_url, transcription, notes_draft) VALUES ($1,$2,$3,$4,$5) RETURNING id',
    [doctorId, appointmentId || null, audioUrl || null, transcription || null, notes]);
  return { id: rows[0].id, notesDraft: notes, source: transcription ? 'draft' : 'template' };
}
export function getSession(id) { return one('SELECT id, appointment_id, transcription, notes_draft, notes_final, signed_at, created_at FROM scribe_sessions WHERE id=$1', [id]); }
export async function saveNotes(id, notesFinal) {
  const { rowCount } = await getPool().query('UPDATE scribe_sessions SET notes_final=$1 WHERE id=$2 AND signed_at IS NULL', [notesFinal, id]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found_or_signed' };
}
export async function signSession(id) {
  const { rowCount } = await getPool().query('UPDATE scribe_sessions SET signed_at=now(), notes_final=COALESCE(notes_final,notes_draft) WHERE id=$1 AND signed_at IS NULL', [id]);
  return rowCount > 0 ? { ok: true, signedAt: new Date().toISOString() } : { error: 'not_found_or_signed' };
}
export function listHistory(doctorId) {
  return safeQuery('SELECT id, appointment_id, signed_at, created_at, (signed_at IS NOT NULL) AS signed FROM scribe_sessions WHERE doctor_id=$1 ORDER BY created_at DESC LIMIT 100', [doctorId]);
}
export function auditAll() {
  return safeQuery('SELECT s.id, s.signed_at, s.created_at, d.display_name AS doctor FROM scribe_sessions s LEFT JOIN doctors d ON d.id=s.doctor_id ORDER BY s.created_at DESC LIMIT 200');
}
export async function drugInteraction(d1, d2) {
  const a = String(d1 || '').toLowerCase().trim(), b = String(d2 || '').toLowerCase().trim();
  const [row] = await safeQuery('SELECT severity, description FROM drug_interactions WHERE (drug1=$1 AND drug2=$2) OR (drug1=$2 AND drug2=$1) LIMIT 1', [a, b]);
  return row || { severity: 'none', description: 'No known interaction in our reference set. This is not a substitute for a pharmacist review.' };
}
export async function addTemplate(doctorId, { templateName, sectionTypes }) {
  const { rows } = await getPool().query('INSERT INTO scribe_templates (doctor_id, template_name, section_types) VALUES ($1,$2,$3) RETURNING id', [doctorId, templateName, sectionTypes || ['Subjective', 'Objective', 'Assessment', 'Plan']]);
  return { id: rows[0].id };
}
export function listTemplates(doctorId) { return safeQuery('SELECT id, template_name, section_types FROM scribe_templates WHERE doctor_id=$1 ORDER BY created_at DESC', [doctorId]); }
