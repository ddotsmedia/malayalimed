import { resolveLocale } from '@/lib/i18n';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Login' };

export default async function LoginPage(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  return (
    <div className="mx-auto max-w-sm space-y-4 py-8">
      <h1 className="text-center text-xl font-bold text-slate-900">{locale === 'ml' ? 'ലോഗിൻ' : 'Login'}</h1>
      <LoginForm locale={locale} />
    </div>
  );
}
