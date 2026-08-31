export const dynamic = 'force-dynamic';

export default function AdminSettings() {
  const rows = [
    ['Site name', 'MalayaliMed'],
    ['Default locale', process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'ml'],
    ['App URL', process.env.NEXT_PUBLIC_APP_URL || 'https://malayalimed.com'],
    ['Payments', process.env.STRIPE_SECRET_KEY ? 'Stripe configured' : 'Stripe not configured'],
    ['Video', process.env.JITSI_DOMAIN || 'meet.jit.si']
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Settings</h1>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <tbody className="divide-y divide-slate-100">
            {rows.map(([l, v]) => <tr key={l}><td className="px-4 py-2 text-slate-600">{l}</td><td className="px-4 py-2 font-medium text-slate-900">{v}</td></tr>)}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400">Environment-driven configuration. Update via .env.production and redeploy.</p>
    </div>
  );
}
