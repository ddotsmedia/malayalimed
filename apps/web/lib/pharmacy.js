// pharmacy.js — medicine inventory.
import { getPool, safeQuery, one } from '@mm/db';

export function listInventory() {
  return safeQuery(`SELECT inv.id, inv.quantity, inv.reorder_level, inv.expiry_date, inv.last_updated,
      m.name AS medicine_name, (inv.quantity <= inv.reorder_level) AS low_stock
    FROM medicine_inventory inv LEFT JOIN medicines m ON m.id=inv.medicine_id
    ORDER BY low_stock DESC, m.name LIMIT 500`);
}
export async function addInventory({ medicineId, quantity, reorderLevel, expiryDate }) {
  const { rows } = await getPool().query(
    'INSERT INTO medicine_inventory (medicine_id, quantity, reorder_level, expiry_date) VALUES ($1,$2,$3,$4) RETURNING id',
    [medicineId || null, parseInt(quantity, 10) || 0, parseInt(reorderLevel, 10) || 10, expiryDate || null]);
  return { id: rows[0].id };
}
export async function inventoryTx({ inventoryId, txType, qty, reason }) {
  const inv = await one('SELECT id, quantity FROM medicine_inventory WHERE id=$1', [inventoryId]);
  if (!inv) return { error: 'not_found' };
  const delta = txType === 'remove' ? -Math.abs(parseInt(qty, 10) || 0) : txType === 'set' ? (parseInt(qty, 10) || 0) - inv.quantity : Math.abs(parseInt(qty, 10) || 0);
  await getPool().query('UPDATE medicine_inventory SET quantity=GREATEST(0, quantity+$2), last_updated=now() WHERE id=$1', [inventoryId, delta]);
  await getPool().query('INSERT INTO inventory_transactions (inventory_id, tx_type, qty, reason) VALUES ($1,$2,$3,$4)', [inventoryId, txType, delta, reason || null]);
  return { ok: true };
}
