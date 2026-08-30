import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { resolveLocale, LOCALES } from '@/lib/i18n';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar locale={locale} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{props.children}</main>
      <Footer locale={locale} />
    </div>
  );
}
