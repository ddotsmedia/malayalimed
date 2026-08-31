import { notFound } from 'next/navigation';
import { resolveLocale, t } from '@/lib/i18n';
import { getQuestionBySlug } from '@/lib/qa';
import { fmtDate } from '@/lib/formatters';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props) {
  const params = await props.params;
  const q = await getQuestionBySlug(params.slug);
  return { title: q ? q.title : 'Question' };
}

export default async function QuestionDetail(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const ml = locale === 'ml';
  const q = await getQuestionBySlug(params.slug);
  if (!q) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-bold text-slate-900">{q.title}</h1>
        <p className="mt-1 text-xs text-slate-400">{fmtDate(q.created_at)} · {(ml ? q.specialty_ml : q.specialty_en) || (ml ? 'പൊതുവായത്' : 'General')}</p>
        <p className="mt-3 whitespace-pre-wrap text-slate-700">{q.body}</p>
      </article>

      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')}</div>

      <section>
        <h2 className="mb-2 text-lg font-bold text-slate-900">{ml ? 'ഡോക്ടർമാരുടെ ഉത്തരങ്ങൾ' : 'Doctor answers'} ({q.answers.length})</h2>
        {q.answers.length === 0 ? <p className="text-sm text-slate-500">{ml ? 'ഇതുവരെ ഉത്തരങ്ങളില്ല. ഒരു വിദഗ്ധ ഡോക്ടർ ഉടൻ മറുപടി നൽകും.' : 'No answers yet — a verified doctor will respond soon.'}</p> : (
          <ul className="space-y-3">
            {q.answers.map((a, i) => (
              <li key={i} className={`rounded-2xl border p-4 ${a.is_accepted ? 'border-brand bg-teal-50' : 'border-slate-200 bg-white'}`}>
                {a.is_accepted && <span className="mb-1 inline-block rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">{ml ? 'സ്വീകരിച്ചു' : 'Accepted'}</span>}
                <p className="whitespace-pre-wrap text-slate-700">{a.body}</p>
                <p className="mt-2 text-xs font-semibold text-brand">— Dr. {a.doctor_name}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
