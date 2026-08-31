// symptomChecker.js — educational (NOT diagnostic) symptom guidance.
// Uses Claude when ANTHROPIC_API_KEY is set; otherwise a deterministic rule-based
// responder. Both return the same shape with mandatory disclaimers + emergency lines.
import { getPool, safeQuery } from '@mm/db';

export const DISCLAIMER = 'This is educational information only and is NOT a medical diagnosis. Always consult a qualified healthcare professional. Emergency: Kerala 112 · Ambulance 108.';
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-20241022';
const RED_FLAGS = ['chest pain', 'shortness of breath', 'difficulty breathing', 'severe bleeding', 'unconscious', 'stroke', 'seizure', 'severe chest'];

const sanitize = (arr) => (Array.isArray(arr) ? arr : [])
  .map((s) => String(s).replace(/[\n\r{}<>]/g, ' ').trim().slice(0, 60))
  .filter(Boolean).slice(0, 12);

export function listSymptomOptions() {
  return safeQuery(`SELECT slug, name_en, name_ml, urgency FROM symptoms WHERE deleted_at IS NULL ORDER BY name_en LIMIT 300`);
}

async function callClaude(symptoms) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const system = 'You are a health information assistant for an educational directory. You NEVER diagnose. Given reported symptoms, return ONLY JSON: {"conditions":[{"name":string,"severity":"routine"|"urgent"|"emergency","action":string,"doctorSpecialty":string}]} with 3-5 educational possibilities. Always frame as possibilities, never diagnosis. Recommend consulting a professional.';
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 700, system, messages: [{ role: 'user', content: `Patient reports: ${symptoms.join(', ')}. Return the JSON.` }] }),
    });
    if (!res.ok) return null;
    const j = await res.json();
    const text = j.content?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : null;
    return Array.isArray(parsed?.conditions) ? parsed.conditions.slice(0, 5) : null;
  } catch { return null; }
}

function ruleBased(symptoms) {
  const joined = symptoms.join(' ').toLowerCase();
  const emergency = RED_FLAGS.some((f) => joined.includes(f));
  const conditions = [];
  if (emergency) conditions.push({ name: 'Potentially serious condition', severity: 'emergency', action: 'Seek emergency care immediately — call 108 (ambulance) or 112.', doctorSpecialty: 'Emergency Medicine' });
  const map = [
    { k: ['fever', 'cough', 'cold', 'sore throat'], c: { name: 'Common viral infection', severity: 'routine', action: 'Rest, fluids; see a doctor if symptoms persist beyond 3–4 days or worsen.', doctorSpecialty: 'General Medicine' } },
    { k: ['headache', 'migraine'], c: { name: 'Tension or migraine headache', severity: 'routine', action: 'Rest and hydration; consult a doctor if severe, frequent, or with vision changes.', doctorSpecialty: 'Neurology' } },
    { k: ['stomach', 'nausea', 'vomit', 'diarrhea', 'abdominal'], c: { name: 'Gastrointestinal upset', severity: 'urgent', action: 'Maintain hydration; see a doctor if persistent, bloody, or with high fever.', doctorSpecialty: 'Gastroenterology' } },
    { k: ['rash', 'itch', 'skin'], c: { name: 'Skin irritation or allergy', severity: 'routine', action: 'Avoid irritants; consult a dermatologist if spreading or painful.', doctorSpecialty: 'Dermatology' } },
    { k: ['joint', 'back pain', 'muscle'], c: { name: 'Musculoskeletal strain', severity: 'routine', action: 'Rest and gentle movement; see a doctor if severe or persistent.', doctorSpecialty: 'Orthopaedics' } },
  ];
  for (const m of map) if (m.k.some((w) => joined.includes(w))) conditions.push(m.c);
  if (conditions.length === 0) conditions.push({ name: 'General symptoms', severity: 'routine', action: 'Monitor your symptoms and consult a healthcare professional for proper evaluation.', doctorSpecialty: 'General Medicine' });
  return conditions.slice(0, 5);
}

export async function runCheck(patientId, symptomsRaw) {
  const symptoms = sanitize(symptomsRaw);
  if (!symptoms.length) return { error: 'no_symptoms' };
  const ai = await callClaude(symptoms);
  const conditions = ai || ruleBased(symptoms);
  const source = ai ? 'ai' : 'rules';
  const result = { conditions, disclaimer: DISCLAIMER, source, aiGenerated: source === 'ai' };
  try {
    await getPool().query('INSERT INTO symptom_checks (patient_id, symptoms, ai_result, source) VALUES ($1,$2,$3,$4)',
      [patientId || null, symptoms, JSON.stringify(result), source]);
  } catch { /* logging is best-effort */ }
  return result;
}

export function history(patientId, limit = 5) {
  return safeQuery('SELECT id, symptoms, ai_result, source, created_at FROM symptom_checks WHERE patient_id=$1 ORDER BY created_at DESC LIMIT $2', [patientId, limit]);
}
