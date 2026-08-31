// anthropic.js — thin Claude client (plain fetch, no SDK). Returns text or null.
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-20241022';

export async function askClaude({ system, user, maxTokens = 500 }) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] }),
    });
    if (!res.ok) return null;
    const j = await res.json();
    return j.content?.[0]?.text || null;
  } catch { return null; }
}

export const hasAnthropicKey = () => !!process.env.ANTHROPIC_API_KEY;
