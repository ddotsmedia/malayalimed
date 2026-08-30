import { resolveLocale, t } from '@/lib/i18n';
import HealthHub from '@/components/HealthHub';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Mental Health' };

export default async function MentalHealth(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const ml = locale === 'ml';
  const topics = ml ? [
    { icon: '😌', title: 'സമ്മർദ്ദ നിയന്ത്രണം', body: 'ശ്വസന വ്യായാമങ്ങളും വിശ്രമവും.' },
    { icon: '💬', title: 'കൗൺസലിംഗ്', body: 'സംസാരിക്കുന്നത് സഹായിക്കും.' },
    { icon: '😴', title: 'ഉറക്കം', body: 'നല്ല ഉറക്കം മാനസികാരോഗ്യത്തിന്.' }
  ] : [
    { icon: '😌', title: 'Stress management', body: 'Breathing exercises and rest.' },
    { icon: '💬', title: 'Counselling', body: 'Talking helps.' },
    { icon: '😴', title: 'Sleep', body: 'Good sleep supports mental health.' }
  ];
  return <HealthHub locale={locale} title={t(locale, 'mental_health')} accent="bg-indigo-50" specialtySlug="psychiatry"
    intro={ml ? 'മാനസികാരോഗ്യ പിന്തുണയും വിദഗ്ധരും. അടിയന്തരം: 112.' : 'Mental-health support and specialists. Emergency: 112.'} topics={topics} />;
}
