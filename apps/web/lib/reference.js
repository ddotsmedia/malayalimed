// reference.js — districts + specialties (cached).
import { safeQuery } from '@mm/db';
import { cached, TTL } from '@mm/cache';

export function listDistricts() {
  return cached('ref:districts', TTL.reference, () =>
    safeQuery('SELECT id, code, name_en, name_ml FROM districts WHERE deleted_at IS NULL ORDER BY name_en'));
}
export function listSpecialties() {
  return cached('ref:specialties', TTL.reference, () =>
    safeQuery('SELECT id, slug, name_en, name_ml, icon FROM specialties WHERE deleted_at IS NULL ORDER BY name_en'));
}
