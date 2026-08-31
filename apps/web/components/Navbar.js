import Link from 'next/link';
import { t } from '@/lib/i18n';

export default function Navbar({ locale = 'ml', authed = false }) {
  const other = locale === 'ml' ? 'en' : 'ml';
  const ml = locale === 'ml';
  const nav = [
    { href: `/${locale}/doctors`, label: t(locale, 'doctors') },
    { href: `/${locale}/hospitals`, label: t(locale, 'hospitals') },
    { href: `/${locale}/lab-tests`, label: locale === 'ml' ? 'ലാബ് ടെസ്റ്റുകൾ' : 'Lab Tests' },
    { href: `/${locale}/ask`, label: locale === 'ml' ? 'ഡോക്ടറോട് ചോദിക്കൂ' : 'Ask a Doctor' },
    { href: `/${locale}/jobs`, label: t(locale, 'jobs') },
    { href: `/${locale}/womens-health`, label: t(locale, 'womens_health') }
  ];
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-black text-brand">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">M</span>
          <span className="hidden sm:inline">{t(locale, 'site')}</span>
        </Link>
        <nav className="ml-2 hidden flex-1 gap-4 text-sm font-medium text-gray-600 md:flex">
          {nav.map((n) => <Link key={n.href} href={n.href} className="hover:text-brand">{n.label}</Link>)}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href={`/${other}`} className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:border-brand hover:text-brand">
            {locale === 'ml' ? 'EN' : 'ML'}
          </Link>
          {authed ? (
            <>
              <Link href={`/${locale}/patient/health-records`} className="hidden text-sm font-medium text-gray-600 hover:text-brand sm:inline">{ml ? 'എന്റെ രേഖകൾ' : 'My Records'}</Link>
              <a href="/api/auth/logout" className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-brand hover:text-brand">{ml ? 'ലോഗൗട്ട്' : 'Logout'}</a>
            </>
          ) : (
            <Link href={`/${locale}/login`} className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark">{ml ? 'ലോഗിൻ' : 'Login'}</Link>
          )}
        </div>
      </div>
    </header>
  );
}
