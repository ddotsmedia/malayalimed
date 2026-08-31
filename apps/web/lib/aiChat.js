// aiChat.js — health-education chatbot (Claude if key set, else rule-based).
import { getPool, safeQuery } from '@mm/db';
import { askClaude } from './anthropic.js';

const SYSTEM = 'You are a health education assistant for a Kerala healthcare directory. Answer educationally, NEVER diagnostically. Keep answers under 180 words. Always end with: "If symptoms persist, consult a doctor." For emergencies mention Kerala 112 / Ambulance 108.';
const CLOSER = 'If symptoms persist, consult a doctor.';

function sanitize(m) {
  let s = String(m == null ? '' : m);
  s = s.split('').filter((ch) => ch.charCodeAt(0) >= 32).join(''); // drop control chars
  return s.replace(/[{}<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 1000);
}

async function specialtyLinks(message) {
  const m = message.toLowerCase();
  const specs = await safeQuery('SELECT id, slug, name_en FROM specialties WHERE deleted_at IS NULL');
  const matched = specs.filter((s) => m.includes(s.name_en.toLowerCase()));
  const out = [];
  for (const s of matched.slice(0, 3)) {
    const [c] = await safeQuery("SELECT count(*)::int AS n FROM doctors WHERE specialty_id=$1 AND deleted_at IS NULL AND listing_status='published'", [s.id]);
    out.push({ specialty: s.name_en, slug: s.slug, doctorCount: c ? c.n : 0 });
  }
  return out;
}

function ruleReply(message) {
  const m = message.toLowerCase();
  if (/emergency|chest pain|breathe|unconscious|bleeding heavily/.test(m))
    return 'This may be an emergency. Please call 108 (ambulance) or 112 immediately. ' + CLOSER;
  if (/symptom/.test(m))
    return 'You can use our Symptom Checker for educational guidance on possible causes and when to seek care. It is not a diagnosis. ' + CLOSER;
  if (/which doctor|which specialist|who should i see/.test(m))
    return 'The right specialist depends on your concern — for example, cardiology for heart-related issues or dermatology for skin. Browse our doctor directory by specialty. ' + CLOSER;
  if (/when.*(see|visit).*doctor/.test(m))
    return 'See a doctor if symptoms are severe, persistent (more than a few days), worsening, or you have concerns like high fever, breathing difficulty, or chest pain. ' + CLOSER;
  return 'Thanks for your question. I can share general health education, but I cannot diagnose. For anything specific to your health, a qualified professional is the best guide. ' + CLOSER;
}

export async function chat(userId, messageRaw) {
  const message = sanitize(messageRaw);
  if (!message) return { error: 'empty_message' };
  const ai = await askClaude({ system: SYSTEM, user: message, maxTokens: 400 });
  let reply = ai ? ai.trim() : ruleReply(message);
  if (!reply.includes(CLOSER)) reply += ' ' + CLOSER;
  const links = await specialtyLinks(message);
  const source = ai ? 'ai' : 'rules';
  try {
    if (userId) await getPool().query(
      'INSERT INTO chat_sessions (patient_id, messages) VALUES ($1,$2)',
      [userId, JSON.stringify([{ role: 'user', text: message }, { role: 'assistant', text: reply, source }])]);
  } catch { /* best-effort logging */ }
  return { message: reply, links, source, aiGenerated: source === 'ai' };
}
