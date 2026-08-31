import { resolveLocale } from '@/lib/i18n';
import { urgentCare } from '@/lib/emergency';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Urgent Care' };

export default async function Page(props) {
  const { locale: l } = await props.params;
  const sp = (await props.searchParams) || {};
  const locale = resolveLocale(l);
  const centres = await urgentCare(sp.district || null);
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Urgent Care Centres</h1>
      {centres.length === 0 ? <p className="text-sm text-gray-400">No urgent care centres listed yet.</p> : (
        <div className="space-y-2">
          {centres.map((c) => (
            <div key={c.id} className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between"><p className="font-semibold text-gray-900">{c.name}</p>{c.phone && <a href={`tel:${c.phone}`} className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white">Call</a>}</div>
              <p className="text-xs text-gray-500">{c.address} · {c.district}</p>
              {c.hours && <p className="text-xs text-gray-400">Hours: {c.hours}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
