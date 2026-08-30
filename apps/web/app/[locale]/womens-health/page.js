import { resolveLocale, t } from '@/lib/i18n';
import HealthHub from '@/components/HealthHub';

export const dynamic = 'force-dynamic';
export const metadata = { title: "Women's Health" };

export default async function WomensHealth(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const ml = locale === 'ml';
  const topics = ml ? [
    { icon: '🤰', title: 'ഗർഭകാല പരിചരണം', body: 'ആന്റിനേറ്റൽ പരിശോധനകളും പോഷണവും.' },
    { icon: '🩺', title: 'സ്ത്രീരോഗ പരിശോധന', body: 'പതിവ് പരിശോധനകൾ പ്രധാനമാണ്.' },
    { icon: '🦴', title: 'അസ്ഥി ആരോഗ്യം', body: 'കാൽസ്യവും വിറ്റാമിൻ D-യും.' }
  ] : [
    { icon: '🤰', title: 'Pregnancy care', body: 'Antenatal check-ups and nutrition.' },
    { icon: '🩺', title: 'Gynae screening', body: 'Regular screening matters.' },
    { icon: '🦴', title: 'Bone health', body: 'Calcium and vitamin D.' }
  ];
  return <HealthHub locale={locale} title={t(locale, 'womens_health')} accent="bg-pink-50" specialtySlug="gynecology"
    intro={ml ? 'സ്ത്രീകളുടെ ആരോഗ്യ വിവരങ്ങളും വിദഗ്ധ ഡോക്ടർമാരും.' : 'Trusted information and specialists for women’s health.'} topics={topics} />;
}
