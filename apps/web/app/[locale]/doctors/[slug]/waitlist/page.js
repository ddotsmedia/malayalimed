import { notFound } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getDoctorBySlug } from '@/lib/doctors';
import WaitlistClient from './WaitlistClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Join Waitlist' };

export default async function Page(props) {
  const { locale: l, slug } = await props.params;
  const locale = resolveLocale(l);
  const d = await getDoctorBySlug(slug);
  if (!d) notFound();
  return <div className="mx-auto max-w-md space-y-4"><h1 className="text-xl font-bold text-gray-900">Waitlist · {d.display_name}</h1><WaitlistClient doctorId={d.id} /></div>;
}
