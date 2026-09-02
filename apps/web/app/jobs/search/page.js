import JobSearchResults from './JobSearchResults';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Job Search' };
export default function Page() {
  return <div className="mx-auto max-w-4xl space-y-4 px-4 py-6"><h1 className="text-xl font-bold text-gray-900">Job Search</h1><JobSearchResults /></div>;
}
