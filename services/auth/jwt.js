// jwt.js — minimal HS256 JWT sign/verify using node:crypto (no jwt package).
import crypto from 'node:crypto';

const ACCESS_TTL = 15 * 60;           // 15 min
const REFRESH_TTL = 30 * 24 * 3600;   // 30 days

const b64url = (buf) => Buffer.from(buf).toString('base64url');
const b64urlJson = (o) => b64url(JSON.stringify(o));
const secret = () => process.env.JWT_SECRET || 'dev-secret-change-me';
const hmac = (data, key) => crypto.createHmac('sha256', key).update(data).digest('base64url');

export function signToken(claims, ttl = ACCESS_TTL) {
  const now = Math.floor(Date.now() / 1000);
  const head = b64urlJson({ alg: 'HS256', typ: 'JWT' });
  const body = b64urlJson({ ...claims, iat: now, exp: now + ttl });
  return `${head}.${body}.${hmac(`${head}.${body}`, secret())}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return { valid: false, error: 'no_token' };
  const [head, body, sig] = token.split('.');
  if (!head || !body || !sig) return { valid: false, error: 'malformed' };
  if (hmac(`${head}.${body}`, secret()) !== sig) return { valid: false, error: 'bad_signature' };
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return { valid: false, error: 'expired' };
    return { valid: true, payload };
  } catch { return { valid: false, error: 'bad_payload' }; }
}

export function signAccess(user) { return signToken({ sub: user.id, role: user.role, type: 'access' }, ACCESS_TTL); }
export function signRefresh(user) { return signToken({ sub: user.id, type: 'refresh' }, REFRESH_TTL); }

export const ACCESS_COOKIE = 'mm_access';
export const REFRESH_COOKIE = 'mm_refresh';
export { ACCESS_TTL, REFRESH_TTL };
