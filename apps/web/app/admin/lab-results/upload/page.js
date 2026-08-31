import UploadClient from './UploadClient';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Upload Lab Result · Admin' };
export default function Page() {
  return <div className="mx-auto max-w-lg space-y-4"><h1 className="text-xl font-bold text-slate-900">Upload Lab Result</h1><UploadClient /></div>;
}
