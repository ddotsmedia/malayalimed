import BedChart from './BedChart';
import ServicesList from './ServicesList';
import FacilityCard from './FacilityCard';
import StaffDirectory from './StaffDirectory';
import DeptCard from './DeptCard';

export default function HospDetail({ hosp, depts, services, facilities, beds, staff }) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">{hosp.name_en}</h1>
        {hosp.name_ml && <p className="text-lg text-gray-600 mb-4">{hosp.name_ml}</p>}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-semibold">{hosp.district}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Rating</p>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold">{hosp.average_rating || 'N/A'}</span>
            </div>
          </div>
        </div>
        {hosp.address && <p className="text-gray-700 mb-3">{hosp.address}</p>}
        {hosp.website && <a href={hosp.website} className="text-blue-600 hover:underline">{hosp.website}</a>}
      </div>

      {beds && <BedChart beds={beds} />}

      {depts?.length > 0 && (
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Departments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {depts.map((d) => (
              <DeptCard key={d.id} dept={d} />
            ))}
          </div>
        </div>
      )}

      {services && <ServicesList services={services} />}

      {facilities?.length > 0 && (
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map((f) => (
              <FacilityCard key={f.id} facility={f} />
            ))}
          </div>
        </div>
      )}

      {staff && <StaffDirectory staff={staff} />}
    </div>
  );
}
