import { notFound, redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import { getAppointmentForUser } from '@/lib/appointments';
import { fmtDate, fmtTime, fmtCurrency } from '@/lib/formatters';
import PaymentForm from '@/components/PaymentForm';
import VideoConsultation from '@/components/VideoConsultation';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Appointment' };

export default async function AppointmentDetail(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const ml = locale === 'ml';
  const s = await getSession();
  if (!s) redirect(`/${locale}`);
  const a = await getAppointmentForUser(params.id, s.userId);
  if (!a) notFound();
  const room = `malayalimed-${a.booking_ref}`;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">{a.doctor_name}</h1>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize">{a.status}</span>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          📅 {fmtDate(a.slot_date)} · {fmtTime(a.slot_start)} · {a.mode} · {ml ? 'റഫറൻസ്' : 'Ref'} {a.booking_ref}
        </p>
        {a.fee != null && <p className="mt-1 text-sm font-semibold text-slate-800">{fmtCurrency(a.fee)}</p>}
      </div>

      {a.fee > 0 && a.status === 'confirmed' && (
        <PaymentForm amountInr={a.fee} appointmentId={a.id} description={`Consultation · ${a.doctor_name}`} locale={locale} />
      )}

      {a.mode === 'video' && (
        <VideoConsultation room={room} domain={process.env.JITSI_DOMAIN || 'meet.jit.si'} displayName={s.userId} locale={locale} />
      )}
    </div>
  );
}
