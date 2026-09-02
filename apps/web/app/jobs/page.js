import { featured } from '@/lib/jobsPortal';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Healthcare Jobs' };
export default async function Page() {
  const jobs = await featured();
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <section className="rounded-3xl bg-gradient-to-br from-brand to-brand-dark p-8 text-white">
        <h1 className="text-3xl font-extrabold">Healthcare Jobs in Kerala</h1>
        <p className="mt-1 text-teal-50">Find your next role — doctors, nurses, allied health.</p>
        <form action="/jobs/search" className="mt-4 flex gap-2"><input name="q" placeholder="Search jobs…" className="flex-1 rounded-lg px-3 py-2 text-sm text-gray-900" /><button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand">Search</button></form>
      </section>
      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold text-gray-900">Featured jobs</h2><a href="/jobs/search" className="text-sm font-semibold text-brand">All jobs →</a></div>
        {jobs.length === 0 ? <p className="text-sm text-gray-400">No jobs posted yet.</p> : (
          <div className="grid gap-3 sm:grid-cols-2">{jobs.map((j) => (
            <a key={j.id} href={`/jobs/${j.id}`} className="rounded-2xl border border-gray-200 bg-white p-4 hover:border-brand">
              <h3 className="font-semibold text-gray-900">{j.title}</h3><p className="text-sm text-gray-600">{j.employer}</p>
              <p className="mt-1 text-xs text-gray-500">{j.location || j.specialty || ''} {(j.salary_min || j.salary_max) ? `· ₹${j.salary_min}–${j.salary_max}` : ''}</p>
            </a>
          ))}</div>
        )}
      </section>
      <div className="flex gap-3 text-sm"><a href="/jobs/salary-check" className="font-semibold text-brand">💰 Salary check</a><a href="/resume" className="font-semibold text-brand">📄 Resume builder</a><a href="/jobs/alerts" className="font-semibold text-brand">🔔 Job alerts</a></div>
    </div>
  );
}
