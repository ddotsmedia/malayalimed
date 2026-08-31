import Link from 'next/link';
import { resolveLocale, t } from '@/lib/i18n';
import { listPublishedQuestions } from '@/lib/qa';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Ask a Doctor' };

export default async function AskPage(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const ml = locale === 'ml';
  const questions = await listPublishedQuestions({});

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">{ml ? 'ഡോക്ടറോട് ചോദിക്കൂ' : 'Ask a Doctor'}</h1>
        <Link href={`/${locale}/ask/new`} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">{ml ? 'ചോദ്യം ചോദിക്കുക' : 'Ask a question'}</Link>
      </div>
      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')}</div>
      {questions.length === 0 ? <EmptyState icon="💬" message={ml ? 'ചോദ്യങ്ങളൊന്നുമില്ല' : 'No questions yet'} /> : (
        <ul className="space-y-3">
          {questions.map((q) => (
            <li key={q.id}>
              <Link href={`/${locale}/ask/${q.slug}`} className="block rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm">
                <h3 className="font-semibold text-slate-900">{q.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{q.body}</p>
                <div className="mt-2 flex gap-3 text-xs text-slate-400">
                  {(ml ? q.specialty_ml : q.specialty_en) && <span>{ml ? q.specialty_ml : q.specialty_en}</span>}
                  <span>💬 {q.answer_count} {ml ? 'ഉത്തരങ്ങൾ' : 'answers'}</span>
                  <span>👁 {q.views}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
