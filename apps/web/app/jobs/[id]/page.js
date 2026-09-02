import JobDetail from './JobDetail';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Job' };
export default function Page(props) {
  return <div className="mx-auto max-w-3xl px-4 py-6"><JobDetail params={props.params} /></div>;
}
