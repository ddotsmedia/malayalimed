import { getPool, safeQuery, one } from '@mm/db';

// NOTE: no real Fitbit/Apple/Google OAuth — connect records a device row; readings
// are recorded manually or via the sync endpoint (no live wearable stream).
export async function connectDevice(patientId, { deviceType, deviceName }) {
  const { rows } = await getPool().query(
    'INSERT INTO iot_devices (patient_id, device_type, device_name, last_sync, is_active) VALUES ($1,$2,$3,now(),true) RETURNING id',
    [patientId, deviceType, deviceName || deviceType]);
  return { id: rows[0].id };
}
export function listDevices(patientId) {
  return safeQuery('SELECT id, device_type, device_name, last_sync, is_active, threshold_low, threshold_high FROM iot_devices WHERE patient_id=$1 ORDER BY created_at DESC', [patientId]);
}
export async function disconnect(id, patientId) {
  const { rowCount } = await getPool().query('UPDATE iot_devices SET is_active=false WHERE id=$1 AND patient_id=$2', [id, patientId]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found' };
}
export async function recordReading(deviceId, patientId, { metricType, value, unit }) {
  const dev = await one('SELECT id, threshold_low, threshold_high FROM iot_devices WHERE id=$1 AND patient_id=$2', [deviceId, patientId]);
  if (!dev) return { error: 'not_found' };
  await getPool().query('INSERT INTO device_metrics (device_id, metric_type, value, unit) VALUES ($1,$2,$3,$4)', [deviceId, metricType, value, unit || null]);
  await getPool().query('UPDATE iot_devices SET last_sync=now() WHERE id=$1', [deviceId]);
  const v = Number(value);
  if ((dev.threshold_low != null && v < dev.threshold_low) || (dev.threshold_high != null && v > dev.threshold_high)) {
    const thr = dev.threshold_high != null && v > dev.threshold_high ? dev.threshold_high : dev.threshold_low;
    await getPool().query('INSERT INTO vital_alerts (patient_id, alert_type, value, threshold, severity) VALUES ($1,$2,$3,$4,$5)', [patientId, metricType, v, thr, 'high']);
  }
  return { ok: true };
}
export function deviceMetrics(deviceId, hours = 24) {
  return safeQuery(`SELECT metric_type, value, unit, recorded_at FROM device_metrics WHERE device_id=$1 AND recorded_at > now()-($2||' hours')::interval ORDER BY recorded_at ASC LIMIT 500`, [deviceId, String(hours)]);
}
export function latestVitals(patientId) {
  return safeQuery(`SELECT DISTINCT ON (m.metric_type) m.metric_type, m.value, m.unit, m.recorded_at
    FROM device_metrics m JOIN iot_devices d ON d.id=m.device_id WHERE d.patient_id=$1 ORDER BY m.metric_type, m.recorded_at DESC`, [patientId]);
}
export async function setThresholds(id, patientId, { thresholdLow, thresholdHigh }) {
  const { rowCount } = await getPool().query('UPDATE iot_devices SET threshold_low=$1, threshold_high=$2 WHERE id=$3 AND patient_id=$4', [thresholdLow ?? null, thresholdHigh ?? null, id, patientId]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found' };
}
export function listAlerts(patientId) {
  return safeQuery('SELECT id, alert_type, value, threshold, severity, acknowledged, created_at FROM vital_alerts WHERE patient_id=$1 ORDER BY created_at DESC LIMIT 100', [patientId]);
}
export async function ackAlert(id, patientId) {
  const { rowCount } = await getPool().query('UPDATE vital_alerts SET acknowledged=true WHERE id=$1 AND patient_id=$2', [id, patientId]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found' };
}
export function vitalTrends(patientId, metric, days = 90) {
  return safeQuery(`SELECT m.recorded_at::date AS d, round(avg(m.value),1) AS value FROM device_metrics m JOIN iot_devices dev ON dev.id=m.device_id
    WHERE dev.patient_id=$1 AND m.metric_type=$2 AND m.recorded_at > now()-($3||' days')::interval GROUP BY 1 ORDER BY 1`, [patientId, metric, String(days)]);
}
export function adminDevices() {
  return safeQuery('SELECT d.id, d.device_type, d.device_name, d.is_active, d.last_sync, u.full_name AS patient FROM iot_devices d LEFT JOIN users u ON u.id=d.patient_id ORDER BY d.created_at DESC LIMIT 300');
}
