import { NextResponse } from 'next/server';
import { applyForJob } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { job_id, professional_id, resume_url, cover_letter } =
      await request.json();

    if (!job_id || !professional_id || !resume_url) {
      return NextResponse.json(
        { data: null, errors: ['missing_fields'] },
        { status: 400 }
      );
    }

    const result = await applyForJob(job_id, professional_id, resume_url, cover_letter || '');

    return NextResponse.json({
      data: result[0] || null,
      errors: null,
    });
  } catch (err) {
    return NextResponse.json(
      { data: null, errors: [err.message] },
      { status: 500 }
    );
  }
}
