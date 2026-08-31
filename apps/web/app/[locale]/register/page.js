import { resolveLocale } from '@/lib/i18n';
import RegisterForm from './RegisterForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Register' };

export default async function RegisterPage(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  return (
    <div className="mx-auto max-w-sm space-y-4 py-8">
      <h1 className="text-center text-xl font-bold text-slate-900">{locale === 'ml' ? 'രജിസ്റ്റർ ചെയ്യുക' : 'Create your account'}</h1>
      <RegisterForm locale={locale} />
    </div>
  );
}
