import BulkImportClient from './BulkImportClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Bulk Import · Admin' };

export default function BulkImportPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Bulk Import</h1>
      <BulkImportClient />
    </div>
  );
}
