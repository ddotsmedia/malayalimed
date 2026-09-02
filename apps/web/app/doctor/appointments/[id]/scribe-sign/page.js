import NotesEditor from '../scribe-notes/NotesEditor';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Sign Notes' };
export default async function Page(props) {
  const { id } = await props.params;
  return <div className="space-y-4"><h1 className="text-xl font-bold text-slate-900">Sign Off Notes</h1><NotesEditor apptId={id} /></div>;
}
