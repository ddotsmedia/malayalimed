import Link from 'next/link';
import { resolveLocale, t } from '@/lib/i18n';
import { listSpecialties, listDistricts } from '@/lib/reference';
import SearchBar from '@/components/SearchBar';

export const dynamic = 'force-dynamic';

export default async function Home(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const ml = locale === 'ml';
  const [specialties] = await Promise.all([listSpecialties(), listDistricts()]);

  const hubs = [
    { href: `/${locale}/womens-health`, icon: '👩', label: t(locale, 'womens_health') },
    { href: `/${locale}/mental-health`, icon: '🧘', label: t(locale, 'mental_health') },
    { href: `/${locale}/child-health`, icon: '🧒', label: t(locale, 'child_health') },
    { href: `/${locale}/jobs`, icon: '💼', label: t(locale, 'jobs') }
  ];

  const sections = [
    { title: ml ? 'ഡോക്ടർമാർ & ആശുപത്രികൾ' : 'Find Care', links: [['🩺', 'Doctors', `/${locale}/doctors`], ['🔎', 'Advanced search', `/${locale}/doctors/search`], ['🏥', 'Hospitals', `/${locale}/hospitals`], ['📅', 'Appointments', `/${locale}/patient/appointments`]] },
    { title: ml ? 'ടെലിഹെൽത്ത് & മെസ്സേജിംഗ്' : 'Consult', links: [['💬', 'Messages', `/${locale}/patient/messages`], ['🤖', 'AI Assistant', `/${locale}/ai-assistant`], ['🩹', 'Symptom Checker', `/${locale}/symptom-checker`], ['🧭', 'Health Journeys', `/${locale}/journeys`]] },
    { title: ml ? 'എന്റെ ആരോഗ്യം' : 'My Health', links: [['📊', 'Health Tracker', `/${locale}/patient/health-tracker`], ['🎯', 'Health Goals', `/${locale}/patient/health-goals`], ['💊', 'Prescriptions', `/${locale}/patient/prescriptions`], ['🧾', 'Bills', `/${locale}/patient/bills`]] },
    { title: ml ? 'റെക്കോർഡുകൾ' : 'Records', links: [['📁', 'Medical History', `/${locale}/patient/medical-history`], ['🧪', 'Lab Results', `/${locale}/patient/lab-results`], ['⚠️', 'Allergies', `/${locale}/patient/health-profile/allergies`], ['🔁', 'Follow-ups', `/${locale}/patient/follow-ups`]] },
    { title: ml ? 'കമ്മ്യൂണിറ്റി' : 'Community', links: [['👥', 'Community', `/${locale}/community`], ['🏆', 'Achievements', `/${locale}/patient/achievements`], ['📰', 'Health Feed', `/${locale}/patient/feed`], ['🎁', 'Referrals', `/${locale}/patient/referrals`]] },
    { title: ml ? 'അടിയന്തരം' : 'Emergency', links: [['🚨', 'Emergency', `/${locale}/emergency`], ['🚑', 'Urgent Care', `/${locale}/urgent-care`], ['🩸', 'Blood Banks', `/${locale}/blood-banks`], ['⛺', 'Health Camps', `/${locale}/health-camps`]] },
    { title: ml ? 'വിവരങ്ങൾ' : 'Directories', links: [['🦠', 'Diseases', `/${locale}/diseases`], ['💉', 'Medicines', `/${locale}/medicines`], ['🧫', 'Lab Tests', `/${locale}/lab-tests`], ['💼', 'Jobs', `/${locale}/jobs`]] },
    { title: ml ? 'സഹായം' : 'Support', links: [['❓', 'FAQ', `/${locale}/support/faq`], ['✉️', 'Contact', `/${locale}/support/contact`], ['⭐', 'Feedback', `/${locale}/support/feedback`], ['🔔', 'Reminders', `/${locale}/patient/settings/notifications`]] },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-brand to-brand-dark p-8 text-white">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{t(locale, 'site')}</h1>
        <p className="mt-2 max-w-xl text-teal-50">{t(locale, 'tagline')}</p>
        <div className="mt-5 rounded-2xl bg-white p-3">
          <SearchBar locale={locale} action={`/${locale}/doctors`} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">{ml ? 'സ്പെഷ്യാലിറ്റികൾ' : 'Specialties'}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {specialties.map((s) => (
            <Link key={s.slug} href={`/${locale}/doctors?specialty=${s.slug}`}
              className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-4 text-center hover:border-brand hover:shadow-sm">
              <span className="text-2xl">{s.icon || '🩺'}</span>
              <span className="mt-1 text-sm font-medium text-gray-800">{ml ? s.name_ml : s.name_en}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">{ml ? 'ആരോഗ്യ കേന്ദ്രങ്ങൾ' : 'Health hubs'}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {hubs.map((h) => (
            <Link key={h.href} href={h.href} className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 hover:border-brand">
              <span className="text-2xl">{h.icon}</span><span className="font-medium text-gray-800">{h.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-gray-900">{ml ? 'എല്ലാ ഫീച്ചറുകളും' : 'Everything on MalayaliMed'}</h2>
          <span className="text-xs font-semibold text-brand">120+ {ml ? 'ഫീച്ചറുകൾ' : 'features'}</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((sec) => (
            <div key={sec.title} className="rounded-2xl border border-gray-200 bg-white p-4">
              <h3 className="mb-2 text-sm font-bold text-gray-900">{sec.title}</h3>
              <ul className="space-y-1">
                {sec.links.map(([icon, label, href]) => (
                  <li key={href}><Link href={href} className="flex items-center gap-2 rounded-lg px-1 py-1 text-sm text-gray-700 hover:text-brand"><span>{icon}</span>{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center">
        <Link href="/admin" className="text-sm font-semibold text-gray-500 hover:text-brand">{ml ? 'അഡ്മിൻ പാനൽ' : 'Admin panel'} →</Link>
      </section>
    </div>
  );
}
