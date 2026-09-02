import { getPool } from '@mm/db';
import { askClaude } from './anthropic.js';

const DISCLAIMER = 'Clinical decision support only — not a diagnosis. The treating clinician must verify. Educational aid.';

function ruleHints(symptoms) {
  const m = symptoms.join(' ').toLowerCase();
  const out = [];
  if (/fever|cough|cold/.test(m)) out.push({ name: 'Upper respiratory infection', confidence: 'moderate' });
  if (/chest pain|breath/.test(m)) out.push({ name: 'Cardiac/respiratory evaluation indicated', confidence: 'high-urgency' });
  if (/thirst|urination|weight loss/.test(m)) out.push({ name: 'Consider diabetes screening', confidence: 'moderate' });
  if (/headache|vision/.test(m)) out.push({ name: 'Neurological/BP evaluation', confidence: 'low' });
  if (!out.length) out.push({ name: 'Non-specific presentation — clinical correlation advised', confidence: 'low' });
  return out;
}

export async function suggestDiagnosis(symptoms, encounterId) {
  const ai = await askClaude({ system: 'You are a clinical decision-support aid for licensed clinicians. Given symptoms, list up to 4 differential considerations as JSON {"suggestions":[{"name":string,"confidence":string}]}. This is support, not diagnosis.', user: `Symptoms: ${symptoms.join(', ')}`, maxTokens: 400 });
  let suggestions = null;
  if (ai) { const mt = ai.match(/\{[\s\S]*\}/); try { suggestions = mt && JSON.parse(mt[0]).suggestions; } catch { suggestions = null; } }
  if (!Array.isArray(suggestions)) suggestions = ruleHints(symptoms);
  const source = ai && suggestions ? 'ai' : 'rules';
  const { rows } = await getPool().query('INSERT INTO diagnosis_suggestions (encounter_id, symptoms, suggested_diagnoses) VALUES ($1,$2,$3) RETURNING id', [encounterId || null, symptoms, JSON.stringify(suggestions)]);
  return { id: rows[0].id, suggestions, source, disclaimer: DISCLAIMER };
}
export async function acceptDiagnosis(id, finalDiagnosis) {
  await getPool().query('UPDATE diagnosis_suggestions SET user_accepted=true, final_diagnosis=$2 WHERE id=$1', [id, finalDiagnosis || null]);
  return { ok: true };
}
export async function interpretLab(labResultId, value, testName) {
  const ai = await askClaude({ system: 'Explain a lab value in plain, educational language for a clinician. Note if it appears outside typical ranges. Not a diagnosis.', user: `${testName || 'Lab'}: ${value}`, maxTokens: 200 });
  const text = ai || `Recorded value: ${value}. Compare against the reference range for ${testName || 'this test'} and correlate clinically.`;
  const { rows } = await getPool().query('INSERT INTO lab_interpretations (lab_result_id, ai_interpretation) VALUES ($1,$2) RETURNING id', [labResultId || null, text]);
  return { id: rows[0].id, interpretation: text, source: ai ? 'ai' : 'rules', disclaimer: DISCLAIMER };
}
