import EncounterForm from './EncounterForm';
export const dynamic = 'force-dynamic';
export default function Page() {
  return <div className="space-y-4"><h1 className="text-xl font-bold text-slate-900">New Encounter</h1><EncounterForm /></div>;
}
