import Link from 'next/link';
import { t } from '@/lib/i18n';
import { EMERGENCY } from '@/lib/constants';

export default function Footer({ locale = 'ml' }) {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-600">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href={`/${locale}/doctors`} className="hover:text-brand">{t(locale, 'doctors')}</Link>
          <Link href={`/${locale}/hospitals`} className="hover:text-brand">{t(locale, 'hospitals')}</Link>
          <Link href={`/${locale}/lab-tests`} className="hover:text-brand">{locale === 'ml' ? 'ലാബ് ടെസ്റ്റുകൾ' : 'Lab Tests'}</Link>
          <Link href={`/${locale}/diseases`} className="hover:text-brand">{locale === 'ml' ? 'രോഗങ്ങൾ' : 'Diseases'}</Link>
          <Link href={`/${locale}/symptoms`} className="hover:text-brand">{locale === 'ml' ? 'ലക്ഷണങ്ങൾ' : 'Symptoms'}</Link>
          <Link href={`/${locale}/medicines`} className="hover:text-brand">{locale === 'ml' ? 'മരുന്നുകൾ' : 'Medicines'}</Link>
          <Link href={`/${locale}/blood-banks`} className="hover:text-brand">{locale === 'ml' ? 'ബ്ലഡ് ബാങ്കുകൾ' : 'Blood Banks'}</Link>
          <Link href={`/${locale}/ask`} className="hover:text-brand">{locale === 'ml' ? 'ഡോക്ടറോട് ചോദിക്കൂ' : 'Ask a Doctor'}</Link>
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
