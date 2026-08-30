// SpecialtyFilter — native select used inside a GET form.
export default function SpecialtyFilter({ specialties = [], selected = '', locale = 'ml' }) {
  const ml = locale === 'ml';
  return (
    <select name="specialty" defaultValue={selected} aria-label="Specialty"
      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none">
      <option value="">{ml ? 'എല്ലാ സ്പെഷ്യാലിറ്റികളും' : 'All specialties'}</option>
      {specialties.map((s) => <option key={s.slug} value={s.slug}>{ml ? s.name_ml : s.name_en}</option>)}
    </select>
  );
}
