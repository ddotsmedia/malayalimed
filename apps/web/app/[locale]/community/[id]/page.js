import PostDetail from './PostDetail';
export const dynamic = 'force-dynamic';
export default async function Page(props) {
  const { id } = await props.params;
  return <div className="mx-auto max-w-2xl"><PostDetail id={id} /></div>;
}
