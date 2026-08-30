import { resolveLocale, t } from '@/lib/i18n';
import HealthHub from '@/components/HealthHub';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Child Health' };

export default async function ChildHealth(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const ml = locale === 'ml';
  const topics = ml ? [
    { icon: '💉', title: 'വാക്സിനേഷൻ', body: 'സമയബന്ധിത പ്രതിരോധ കുത്തിവയ്പ്പുകൾ.' },
    { icon: '🍎', title: 'പോഷണം', body: 'വളർച്ചയ്ക്ക് സമീകൃത ആഹാരം.' },
    { icon: '🌡️', title: 'പനി പരിചരണം', body: 'ജലാംശം നിലനിർത്തുക.' }
  ] : [
    { icon: '💉', title: 'Vaccination', body: 'Timely immunisation schedule.' },
    { icon: '🍎', title: 'Nutrition', body: 'Balanced diet for growth.' },
    { icon: '🌡️', title: 'Fever care', body: 'Keep the child hydrated.' }
  ];
  return <HealthHub locale={locale} title={t(locale, 'child_health')} accent="bg-emerald-50" specialtySlug="pediatrics"
    intro={ml ? 'കുട്ടികളുടെ ആരോഗ്യ വിവരങ്ങളും ശിശുരോഗ വിദഗ്ധരും.' : 'Child-health information and paediatric specialists.'} topics={topics} />;
}
