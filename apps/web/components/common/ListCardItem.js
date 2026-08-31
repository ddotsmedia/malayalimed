export default function ListCardItem({ href, title, subtitle, right, badge, onClick }) {
  const inner = (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 hover:border-brand">
      <div className="min-w-0">
        <div className="flex items-center gap-2"><p className="truncate font-semibold text-gray-900">{title}</p>{badge}</div>
        {subtitle && <p className="truncate text-xs text-gray-500">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0 text-right text-sm">{right}</div>}
    </div>
  );
  if (href) return <a href={href} className="block">{inner}</a>;
  return <button onClick={onClick} className="block w-full text-left">{inner}</button>;
}
