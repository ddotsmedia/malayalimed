import { z } from 'zod';

export const ProfessionalSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  role: z.enum(['doctor', 'nurse', 'pharmacist', 'paramedic', 'lab_tech', 'physiotherapist', 'dentist', 'counselor']),
  specialties: z.array(z.string()).min(1),
  bio: z.string().max(1000).optional(),
  profilePhotoUrl: z.string().url().optional(),
  locationDistrict: z.string(),
  averageRating: z.number().min(0).max(5).optional(),
  verificationStatus: z.enum(['pending', 'verified', 'rejected']).default('pending'),
  badges: z.array(z.string()).optional(),
  isAvailableForWork: z.boolean().default(false),
});

export const HospitalSchema = z.object({
  id: z.string().uuid().optional(),
  nameEn: z.string().max(300),
  nameMl: z.string().max(300).optional(),
  address: z.string().optional(),
  district: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  bedsTotal: z.number().int().positive(),
  icuBeds: z.number().int().nonnegative(),
  ccuBeds: z.number().int().nonnegative(),
  generalBeds: z.number().int().nonnegative(),
  averageRating: z.number().min(0).max(5).optional(),
  isVerified: z.boolean().default(false),
  accreditations: z.array(z.string()).optional(),
  website: z.string().url().optional(),
});

export const CredentialSchema = z.object({
  id: z.string().uuid().optional(),
  professionalId: z.string().uuid(),
  credType: z.enum(['medical_license', 'nursing_license', 'pharmacy_license', 'other']),
  credentialName: z.string().max(300),
  credentialNumber: z.string().max(100),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  issuingBody: z.string().max(300),
  verificationStatus: z.enum(['pending', 'verified', 'rejected']).default('pending'),
});

export const ReviewSchema = z.object({
  id: z.string().uuid().optional(),
  professionalId: z.string().uuid().optional(),
  hospitalId: z.string().uuid().optional(),
  reviewerId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().max(2000),
  category: z.enum(['bedside_manner', 'expertise', 'cleanliness', 'wait_time', 'overall']).optional(),
});

export const EndorsementSchema = z.object({
  id: z.string().uuid().optional(),
  professionalId: z.string().uuid(),
  endorserId: z.string().uuid(),
  skill: z.string().max(200),
});

export const AvailabilitySchema = z.object({
  id: z.string().uuid().optional(),
  professionalId: z.string().uuid(),
  openToLocum: z.boolean().default(false),
  openToFreelance: z.boolean().default(false),
  openToTelemedicine: z.boolean().default(false),
  openToFulltime: z.boolean().default(false),
});

export const BadgeSchema = z.object({
  badgeType: z.string(),
  name: z.string().max(200),
  iconUrl: z.string().url(),
  description: z.string(),
  criteria: z.string(),
});

export const DepartmentSchema = z.object({
  id: z.string().uuid().optional(),
  hospitalId: z.string().uuid(),
  departmentName: z.string().max(200),
  specialty: z.string().max(100),
  headDoctorId: z.string().uuid().optional(),
  staffCount: z.number().int().nonnegative().default(0),
});

export const ServiceSchema = z.object({
  id: z.string().uuid().optional(),
  hospitalId: z.string().uuid(),
  serviceName: z.string().max(200),
  available: z.boolean().default(true),
  description: z.string().optional(),
});

export const FacilitySchema = z.object({
  id: z.string().uuid().optional(),
  hospitalId: z.string().uuid(),
  facilityName: z.string().max(200),
  facilityType: z.enum(['equipment', 'lab', 'imaging', 'pharmacy', 'other']),
  count: z.number().int().nonnegative().default(0),
});

export const BedAvailabilitySchema = z.object({
  id: z.string().uuid().optional(),
  hospitalId: z.string().uuid(),
  bedType: z.enum(['ICU', 'General', 'CCU']),
  totalBeds: z.number().int().positive(),
  availableBeds: z.number().int().nonnegative(),
});

export const SearchQuerySchema = z.object({
  q: z.string().optional(),
  specialty: z.string().optional(),
  district: z.string().optional(),
  minRating: z.number().min(0).max(5).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
});
