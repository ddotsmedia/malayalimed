import DeviceList from './DeviceList';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'My Devices' };
export default function Page() {
  return <div className="space-y-4"><h1 className="text-xl font-bold text-gray-900">Connected Devices</h1><DeviceList /></div>;
}
