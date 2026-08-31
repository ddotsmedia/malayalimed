import InventoryClient from './InventoryClient';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Pharmacy Inventory · Admin' };
export default function Page() {
  return <div className="space-y-4"><h1 className="text-xl font-bold text-slate-900">Pharmacy Inventory</h1><InventoryClient /></div>;
}
