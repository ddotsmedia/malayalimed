import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { resolveLocale, LOCALES } from '@/lib/i18n';
import { getSession } from '@/lib/session';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamic = 'force-dynamic';

export default async function LocaleLayout(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const session = await getSession();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar locale={locale} authed={!!session} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{props.children}</main>
      <Footer locale={locale} />
    </div>
  );
}
