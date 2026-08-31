'use client';
export default function ShareButton({ url, text = 'Check this out', label = 'Share' }) {
  function share() {
    const full = url?.startsWith('http') ? url : (typeof window !== 'undefined' ? window.location.origin + (url || window.location.pathname) : url);
    if (typeof navigator !== 'undefined' && navigator.share) navigator.share({ text, url: full }).catch(() => {});
    else window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + full)}`, '_blank');
  }
  return <button onClick={share} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-brand">{label}</button>;
}
