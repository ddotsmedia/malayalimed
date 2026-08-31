export default function DashboardQuickActions({ locale = 'ml' }) {
  const actions = [
    ['🩺 Book', `/${locale}/doctors`],
    ['💊 Upload Rx', `/${locale}/patient/prescriptions`],
    ['🤔 Ask a Doctor', `/${locale}/ask`],
    ['🔁 Refill', `/${locale}/patient/prescriptions`],
  ];
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {actions.map(([label, href]) => (
        <a key={label} href={href} className="rounded-xl bg-brand px-3 py-3 text-center text-sm font-semibold text-white hover:opacity-90">{label}</a>
      ))}
    </div>
  );
}
