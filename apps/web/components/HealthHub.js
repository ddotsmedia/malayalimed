import Link from 'next/link';
import { t } from '@/lib/i18n';

// Reusable health-hub layout for women's / mental / child health pages.
export default function HealthHub({ locale = 'ml', title, intro, topics = [], accent = 'bg-pink-50', specialtySlug }) {
  return (
    <div className="space-y-6">
      <div className={`rounded-2xl ${accent} p-6`}>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-600">{intro}</p>
      </div>
      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')}</div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((tp) => (
          <div key={tp.title} className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-2xl">{tp.icon}</div>
            <h3 className="mt-1 font-semibold text-gray-900">{tp.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{tp.body}</p>
          </div>
        ))}
      </div>
      {specialtySlug && (
        <Link href={`/${locale}/doctors?specialty=${specialtySlug}`}
          className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          {t(locale, 'find_doctor')} →
        </Link>
      )}
    </div>
  );
}
