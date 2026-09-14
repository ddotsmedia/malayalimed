import { safeQuery } from '@mm/db';

export async function listJobs(limit = 20, offset = 0) {
  return safeQuery(
    `SELECT id, position_title, position_type, specialization, salary_min, salary_max, location_district, job_status, posted_at FROM jobs WHERE deleted_at IS NULL ORDER BY posted_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
}

export async function searchJobs(filters = {}) {
  const { q = '', specialization = '', district = '', minSalary = 0, jobType = '', limit = 20, offset = 0 } = filters;
  const where = ['deleted_at IS NULL'];
  const vals = [];

  if (q) {
    vals.push(`%${q}%`);
    where.push(`position_title ILIKE $${vals.length}`);
  }
  if (specialization) {
    vals.push(specialization);
    where.push(`specialization = $${vals.length}`);
  }
  if (district) {
    vals.push(district);
    where.push(`location_district = $${vals.length}`);
  }
  if (minSalary > 0) {
    vals.push(minSalary);
    where.push(`salary_max >= $${vals.length}`);
  }
  if (jobType) {
    vals.push(jobType);
    where.push(`position_type = $${vals.length}`);
  }

  vals.push(limit);
  vals.push(offset);

  return safeQuery(
    `SELECT id, position_title, position_type, specialization, salary_min, salary_max, location_district, job_status, posted_at FROM jobs WHERE ${where.join(' AND ')} ORDER BY posted_at DESC LIMIT $${vals.length - 1} OFFSET $${vals.length}`,
    vals
  );
}

export async function getJob(id) {
  const rows = await safeQuery(
    `SELECT id, hospital_id, position_title, position_type, specialization, experience_required, salary_min, salary_max, description, location_district, job_status, posted_at FROM jobs WHERE id=$1 AND deleted_at IS NULL`,
    [id]
  );
  return rows[0] || null;
}

export async function getJobApplications(jobId) {
  return safeQuery(
    `SELECT ja.id, ja.professional_id, ja.application_status, ja.resume_url, ja.cover_letter, ja.applied_at, p.role, p.specialties, p.average_rating FROM job_applications ja JOIN professionals p ON ja.professional_id=p.id WHERE ja.job_id=$1 AND ja.deleted_at IS NULL ORDER BY ja.applied_at DESC`,
    [jobId]
  );
}

export async function applyForJob(jobId, profId, resumeUrl, coverLetter = '') {
  return safeQuery(
    `INSERT INTO job_applications (job_id, professional_id, resume_url, cover_letter, applied_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id, application_status, applied_at`,
    [jobId, profId, resumeUrl, coverLetter]
  );
}

export async function getDistinctSpecializations() {
  return safeQuery(
    `SELECT DISTINCT specialization FROM jobs WHERE deleted_at IS NULL AND specialization IS NOT NULL ORDER BY specialization`
  );
}

export async function getJobsByDistrict(district, limit = 20) {
  return safeQuery(
    `SELECT id, position_title, specialization, salary_min, salary_max, job_status FROM jobs WHERE deleted_at IS NULL AND location_district=$1 ORDER BY posted_at DESC LIMIT $2`,
    [district, limit]
  );
}

export async function getJobsBySpecialization(specialization, limit = 20) {
  return safeQuery(
    `SELECT id, position_title, position_type, salary_min, salary_max, location_district, job_status FROM jobs WHERE deleted_at IS NULL AND specialization=$1 ORDER BY posted_at DESC LIMIT $2`,
    [specialization, limit]
  );
}

export async function countJobs() {
  const rows = await safeQuery(`SELECT COUNT(*) as cnt FROM jobs WHERE deleted_at IS NULL`);
  return rows[0]?.cnt || 0;
}

export async function jobFilters() {
  const specs = await getDistinctSpecializations();
  const dists = await getDistinctDistricts();
  return {
    specializations: specs.map(s => s.specialization),
    districts: dists.map(d => d.location_district),
  };
}

export async function salaryInsights(specialization = null, district = null) {
  const where = ['deleted_at IS NULL'];
  const vals = [];

  if (specialization) {
    vals.push(specialization);
    where.push(`specialization = $${vals.length}`);
  }
  if (district) {
    vals.push(district);
    where.push(`location_district = $${vals.length}`);
  }

  const rows = await safeQuery(
    `SELECT 
      MIN(salary_min) as min_salary,
      MAX(salary_max) as max_salary,
      AVG((salary_min + salary_max) / 2) as avg_salary,
      COUNT(*) as job_count
     FROM jobs WHERE ${where.join(' AND ')}`,
    vals
  );
  return rows[0] || { min_salary: 0, max_salary: 0, avg_salary: 0, job_count: 0 };
}
