// crypto — AES-256-GCM column encryption using node:crypto (no dependency).
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';

const ALGO = 'aes-256-gcm';
const KEY_LEN = 32;

function key() {
  const secret = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || 'malayalimed-dev-key';
  return scryptSync(secret, 'mm-column-salt', KEY_LEN);
}

// Returns "v1:<ivHex>:<tagHex>:<cipherHex>". Null/empty passthrough.
export function encryptField(plain) {
  if (plain == null || plain === '') return plain;
  const iv = randomBytes(12);
  const c = createCipheriv(ALGO, key(), iv);
  const enc = Buffer.concat([c.update(String(plain), 'utf8'), c.final()]);
  const tag = c.getAuthTag();
  return `v1:${iv.toString('hex')}:${tag.toString('hex')}:${enc.toString('hex')}`;
}

export function decryptField(blob) {
  if (blob == null || blob === '' || typeof blob !== 'string' || !blob.startsWith('v1:')) return blob;
  try {
    const [, ivHex, tagHex, dataHex] = blob.split(':');
    const d = createDecipheriv(ALGO, key(), Buffer.from(ivHex, 'hex'));
    d.setAuthTag(Buffer.from(tagHex, 'hex'));
    return Buffer.concat([d.update(Buffer.from(dataHex, 'hex')), d.final()]).toString('utf8');
  } catch { return null; }
}

// Deterministic token for a searchable blind-index (not reversible).
export function hashField(plain) {
  if (plain == null || plain === '') return plain;
  return scryptSync(String(plain), 'mm-blind-index', 16).toString('hex');
}
