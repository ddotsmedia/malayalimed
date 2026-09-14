import { NextResponse } from 'next/server';
import { getJob, getJobApplications } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const [job, applications] = await Promise.all([
      getJob(params.id),
      getJobApplications(params.id),
    ]);

    if (!job) {
      return NextResponse.json(
        { data: null, errors: ['not_found'] },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: { ...job, applications },
      errors: null,
    });
  } catch (err) {
    return NextResponse.json(
      { data: null, errors: [err.message] },
      { status: 500 }
    );
  }
}
