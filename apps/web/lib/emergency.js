import { safeQuery } from '@mm/db';

export function emergencyHospitals() {
  return safeQuery(`SELECT h.id, h.slug, h.name_en, h.phone, di.name_en AS district FROM hospitals h LEFT JOIN districts di ON di.id=h.district_id
    WHERE h.emergency_24x7=true AND h.deleted_at IS NULL ORDER BY di.name_en LIMIT 100`);
}
export function urgentCare(districtId) {
  const args = []; let where = '1=1';
  if (districtId) { args.push(districtId); where = 'u.district_id=$1'; }
  return safeQuery(`SELECT u.id, u.name, u.phone, u.address, u.hours, di.name_en AS district FROM urgent_care_centers u LEFT JOIN districts di ON di.id=u.district_id WHERE ${where} ORDER BY u.name LIMIT 100`, args);
}
export function ambulanceContacts() {
  return safeQuery(`SELECT e.id, e.phone, e.response_time_minutes, h.name_en AS hospital FROM emergency_contacts e LEFT JOIN hospitals h ON h.id=e.hospital_id WHERE e.ambulance_available=true ORDER BY e.response_time_minutes LIMIT 100`);
}
