export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <div className="text-5xl">🔍</div>
      <h2 className="mt-3 text-lg font-bold text-slate-900">Page not found</h2>
      <p className="mt-1 text-sm text-slate-500">The page you’re looking for doesn’t exist.</p>
      <a href="/ml" className="mt-4 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Back home</a>
    </div>
  );
}
