'use client';

// Renders a data-URI file (image or PDF). Download uses the data URI directly.
export default function PrescriptionViewer({ fileUrl, fileName }) {
  if (!fileUrl) return null;
  const isPdf = fileUrl.startsWith('data:application/pdf') || (fileName || '').toLowerCase().endsWith('.pdf');
  return (
    <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4">
      {isPdf
        ? <iframe src={fileUrl} title="prescription" className="h-[480px] w-full rounded-lg border" />
        : <img src={fileUrl} alt="prescription" className="max-h-[480px] rounded-lg" />}
      <a href={fileUrl} download={fileName || 'prescription'} className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Download</a>
    </div>
  );
}
