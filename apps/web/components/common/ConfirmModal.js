'use client';
export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', onConfirm, onClose, busy }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-sm space-y-3 rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-gray-900">{title}</h3>
        {message && <p className="text-sm text-gray-600">{message}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">Cancel</button>
          <button onClick={onConfirm} disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? '…' : confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
