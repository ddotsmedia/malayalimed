import CertForm from './CertForm';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Certifications' };
export default function Page() {
  return <div className="space-y-4"><h1 className="text-xl font-bold text-slate-900">My Certifications</h1><CertForm /></div>;
}
