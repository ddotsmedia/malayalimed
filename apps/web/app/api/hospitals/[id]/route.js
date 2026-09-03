import { NextResponse } from 'next/server';
import { getHosp, getHospDepts, getHospServices, getHospFacilities, getBedAvailability, getHospStaff } from '@/lib/hospitals';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const [hosp, depts, services, facilities, beds, staff] = await Promise.all([
    getHosp(params.id),
    getHospDepts(params.id),
    getHospServices(params.id),
    getHospFacilities(params.id),
    getBedAvailability(params.id),
    getHospStaff(params.id),
  ]);
  if (!hosp) return NextResponse.json({ errors: ['not found'] }, { status: 404 });
  return NextResponse.json({
    data: { hosp, depts, services, facilities, beds, staff },
    errors: null,
  });
}
