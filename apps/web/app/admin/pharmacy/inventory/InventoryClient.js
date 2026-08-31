'use client';
import { useEffect, useState } from 'react';

export default function InventoryClient() {
  const [rows, setRows] = useState([]);
  const load = () => fetch('/api/admin/pharmacy/inventory').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  async function tx(inventoryId, txType) {
    const qty = window.prompt(`Quantity to ${txType}:`); if (qty == null) return;
    await fetch('/api/admin/inventory-tx', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ inventoryId, txType, qty }) });
    load();
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-3 py-2">Medicine</th><th className="px-3 py-2">Qty</th><th className="px-3 py-2">Reorder</th><th className="px-3 py-2">Expiry</th><th className="px-3 py-2 text-right">Adjust</th></tr></thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-400">No inventory. Add via POST /api/admin/pharmacy/inventory.</td></tr> :
            rows.map((r) => (
              <tr key={r.id} className={r.low_stock ? 'bg-red-50' : ''}>
                <td className="px-3 py-2">{r.medicine_name || '—'}</td>
                <td className="px-3 py-2 font-semibold">{r.quantity}{r.low_stock && <span className="ml-1 text-xs text-red-600">low</span>}</td>
                <td className="px-3 py-2">{r.reorder_level}</td>
                <td className="px-3 py-2 text-slate-500">{r.expiry_date ? String(r.expiry_date).slice(0, 10) : '—'}</td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => tx(r.id, 'add')} className="mr-1 rounded bg-green-600 px-2 py-1 text-xs text-white">+</button>
                  <button onClick={() => tx(r.id, 'remove')} className="rounded bg-red-600 px-2 py-1 text-xs text-white">−</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
