import Link from 'next/link';
import { t } from '@/lib/i18n';
import { EMERGENCY } from '@/lib/constants';

export default function Footer({ locale = 'ml' }) {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-600">
        <div className="flex flex-wrap gap-6">
          <Link href={`/${locale}/doctors`} className="hover:text-brand">{t(locale, 'doctors')}</Link>
          <Link href={`/${locale}/hospitals`} className="hover:text-brand">{t(locale, 'hospitals')}</Link>
          <Link href={`/${locale}/jobs`} className="hover:text-brand">{t(locale, 'jobs')}</Link>
        </div>
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')}</p>
        <p className="mt-3 text-xs text-gray-400">
          🚑 {t(locale, 'site')} · Emergency {EMERGENCY.national} · Ambulance {EMERGENCY.ambulance} · © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
