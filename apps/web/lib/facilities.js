// facilities.js — pharmacies, ambulance, dental, eye, mental-health centres.
import { safeQuery, one } from '@mm/db';
const like = (q) => `%${String(q || '').toLowerCase()}%`;

const contactList = (table) => (q = '') => safeQuery(
  `SELECT f.*, di.name_en AS district_en, di.name_ml AS district_ml FROM ${table} f
   LEFT JOIN districts di ON di.id=f.district_id
   WHERE f.deleted_at IS NULL AND ($1='' OR lower(f.name) LIKE $2) ORDER BY f.name`, [q, like(q)]);

const clinicList = (table) => (q = '') => safeQuery(
  `SELECT f.slug, f.name_en, f.name_ml, f.address, f.phone, f.services, di.name_en AS district_en, di.name_ml AS district_ml
   FROM ${table} f LEFT JOIN districts di ON di.id=f.district_id
   WHERE f.deleted_at IS NULL AND ($1='' OR lower(f.name_en) LIKE $2) ORDER BY f.name_en`, [q, like(q)]);

const clinicGet = (table) => (slug) => safeQuery(
  `SELECT f.*, di.name_en AS district_en, di.name_ml AS district_ml FROM ${table} f
   LEFT JOIN districts di ON di.id=f.district_id WHERE f.slug=$1 AND f.deleted_at IS NULL`, [slug]).then((r) => r[0] || null);

export const listPharmacies = contactList('pharmacies');
export const listAmbulance = contactList('ambulance_services');
export const listDental = clinicList('dental_clinics');
export const getDental = clinicGet('dental_clinics');
export const listEye = clinicList('eye_hospitals');
export const getEye = clinicGet('eye_hospitals');
export const listMental = clinicList('mental_health_centres');
export const getMental = clinicGet('mental_health_centres');
