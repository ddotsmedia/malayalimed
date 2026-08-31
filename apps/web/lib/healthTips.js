// healthTips.js — daily rotating health tip (Claude if key set, else static rotation).
import { cached } from '@mm/cache';
import { askClaude } from './anthropic.js';

const TIPS = [
  'Aim for 30 minutes of moderate activity most days — a brisk walk counts.',
  'Stay hydrated: most adults benefit from 6–8 glasses of water a day.',
  'Add a serving of vegetables or fruit to every meal for more fibre and vitamins.',
  'Consistent sleep (7–8 hours) supports immunity, mood, and metabolism.',
  'Take short breaks to stretch if you sit for long periods.',
  'Limit added sugar and ultra-processed snacks; choose nuts or fruit instead.',
  'Wash hands regularly — it is one of the simplest ways to prevent infection.',
  'Manage stress with a few minutes of slow breathing or a short walk outdoors.',
];
const FALLBACK_SUFFIX = ' This is general wellness information, not medical advice.';

export function todaysTip() {
  const key = 'tip:' + new Date().toISOString().slice(0, 10);
  return cached(key, 86400, async () => {
    const ai = await askClaude({
      system: 'You are a health educator. Give ONE concise general wellness tip (max 30 words). No diagnosis, no medication advice.',
      user: 'Give today\'s general wellness tip.', maxTokens: 80,
    });
    if (ai) return { tip: ai.trim(), source: 'ai' };
    const idx = Math.floor(Date.now() / 86400000) % TIPS.length;
    return { tip: TIPS[idx] + FALLBACK_SUFFIX, source: 'static' };
  });
}
