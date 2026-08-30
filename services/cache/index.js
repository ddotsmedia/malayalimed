// cache/index.js — lightweight in-process cache with TTL. No external client, so
// it works without Redis running; swap the store for a Redis client in prod by
// implementing the same get/set/del interface.

const store = new Map(); // key -> { value, expires }

export function set(key, value, ttlSeconds = 300) {
  store.set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
}

export function get(key) {
  const hit = store.get(key);
  if (!hit) return undefined;
  if (hit.expires < Date.now()) { store.delete(key); return undefined; }
  return hit.value;
}

export function del(key) { store.delete(key); }

/** Memoise an async function's result for ttl seconds. */
export async function cached(key, ttlSeconds, fn) {
  const hit = get(key);
  if (hit !== undefined) return hit;
  const value = await fn();
  set(key, value, ttlSeconds);
  return value;
}

export const TTL = { short: 60, providers: 300, reference: 3600 };
