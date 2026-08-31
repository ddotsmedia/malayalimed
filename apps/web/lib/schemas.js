// schemas.js — package-free Zod-style validation (safeParse API, no dependency).
function ok(data) { return { success: true, data }; }
function fail(msg) { return { success: false, error: msg }; }
const isUuid = (v) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
const isEmail = (v) => typeof v === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
const isPhone = (v) => typeof v === 'string' && /^[6-9]\d{9}$/.test(String(v).replace(/\D/g, '').slice(-10));

export const reviewSchema = {
  safeParse({ rating, text, entityId } = {}) {
    const r = parseInt(rating, 10);
    if (!(r >= 1 && r <= 5)) return fail('rating must be 1-5');
    if (!isUuid(entityId)) return fail('invalid entity');
    if (text != null && String(text).length > 2000) return fail('review too long');
    return ok({ rating: r, text: text || '', entityId });
  },
};

export const authSchema = {
  safeParse({ email, phone, password } = {}) {
    if (!email && !phone) return fail('email or phone required');
    if (email && !isEmail(email)) return fail('invalid email');
    if (phone && !isPhone(phone)) return fail('invalid phone');
    if (password != null && String(password).length < 8) return fail('password min 8 chars');
    return ok({ email: email || null, phone: phone || null, password });
  },
};

export const appointmentSchema = {
  safeParse({ doctorId, slotStart } = {}) {
    if (!isUuid(doctorId)) return fail('invalid doctor');
    if (!slotStart || isNaN(Date.parse(slotStart))) return fail('invalid slot');
    return ok({ doctorId, slotStart });
  },
};

export const healthRecordSchema = {
  safeParse({ title, recordType } = {}) {
    if (!title || String(title).trim().length < 2) return fail('title required');
    if (recordType && String(recordType).length > 60) return fail('invalid type');
    return ok({ title: String(title).trim(), recordType: recordType || 'note' });
  },
};

export { isUuid, isEmail, isPhone };
