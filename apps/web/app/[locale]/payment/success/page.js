import { resolveLocale } from '@/lib/i18n';
import { confirmPayment } from '@/lib/payments';

export const dynamic = 'force-dynamic';

export default async function PaymentSuccess(props) {
  const params = await props.params;
  const sp = (await props.searchParams) || {};
  const locale = resolveLocale(params.locale);
  const ml = locale === 'ml';
  if (sp.session_id) await confirmPayment(sp.session_id);
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="text-5xl">✅</div>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">{ml ? 'പണമടച്ചു!' : 'Payment successful'}</h1>
      <p className="mt-1 text-sm text-slate-500">{ml ? 'നിങ്ങളുടെ അപ്പോയിന്റ്മെന്റ് സ്ഥിരീകരിച്ചു.' : 'Your appointment is confirmed.'}</p>
      <a href={`/${locale}`} className="mt-5 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">{ml ? 'ഹോമിലേക്ക്' : 'Back home'}</a>
    </div>
  );
}
