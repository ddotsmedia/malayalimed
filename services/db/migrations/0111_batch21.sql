-- Batch 21: Professionals + Hospitals (all additive, ON CONFLICT DO NOTHING)
CREATE TABLE IF NOT EXISTS professionals (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID REFERENCES users(id), role VARCHAR(100), specialties TEXT[], bio TEXT, profile_photo_url VARCHAR(500), location_district VARCHAR(100), average_rating DECIMAL(3,2), verification_status VARCHAR(50), badges TEXT[], is_available_for_work BOOLEAN DEFAULT false, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_prof_role ON professionals(role);
CREATE INDEX IF NOT EXISTS idx_prof_district ON professionals(location_district);

CREATE TABLE IF NOT EXISTS credentials (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), professional_id UUID REFERENCES professionals(id), cred_type VARCHAR(100), credential_name VARCHAR(300), credential_number VARCHAR(100), issue_date DATE, expiry_date DATE, issuing_body VARCHAR(300), verification_status VARCHAR(50), verified_by UUID, verified_at TIMESTAMP, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_cred_prof ON credentials(professional_id);

CREATE TABLE IF NOT EXISTS professional_badges (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), professional_id UUID REFERENCES professionals(id), badge_type VARCHAR(100), awarded_date TIMESTAMP, reason TEXT);

CREATE TABLE IF NOT EXISTS badge_definitions (badge_type VARCHAR(100) PRIMARY KEY, name VARCHAR(200), icon_url VARCHAR(500), description TEXT, criteria TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS endorsements (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), professional_id UUID REFERENCES professionals(id), endorser_id UUID, skill VARCHAR(200), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE(professional_id, endorser_id, skill));
CREATE INDEX IF NOT EXISTS idx_endorse_prof ON endorsements(professional_id);

CREATE TABLE IF NOT EXISTS professional_reviews (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), professional_id UUID REFERENCES professionals(id), reviewer_id UUID, rating INT CHECK (rating >= 1 AND rating <= 5), review_text TEXT, category VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_review_prof ON professional_reviews(professional_id);

CREATE TABLE IF NOT EXISTS professional_availability (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), professional_id UUID REFERENCES professionals(id), open_to_locum BOOLEAN DEFAULT false, open_to_freelance BOOLEAN DEFAULT false, open_to_telemedicine BOOLEAN DEFAULT false, open_to_fulltime BOOLEAN DEFAULT false, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE(professional_id));

CREATE TABLE IF NOT EXISTS hospitals (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name_en VARCHAR(300) NOT NULL, name_ml VARCHAR(300), address TEXT, district VARCHAR(100), lat DECIMAL(10,8), lng DECIMAL(11,8), phone VARCHAR(20), email VARCHAR(200), beds_total INT, icu_beds INT, ccu_beds INT, general_beds INT, average_rating DECIMAL(3,2), is_verified BOOLEAN DEFAULT false, accreditations TEXT[], website VARCHAR(500), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_hosp_district ON hospitals(district);
CREATE INDEX IF NOT EXISTS idx_hosp_name ON hospitals(name_en);

CREATE TABLE IF NOT EXISTS hospital_departments (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), hospital_id UUID REFERENCES hospitals(id), department_name VARCHAR(200), specialty VARCHAR(100), head_doctor_id UUID, staff_count INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_dept_hosp ON hospital_departments(hospital_id);

CREATE TABLE IF NOT EXISTS hospital_services (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), hospital_id UUID REFERENCES hospitals(id), service_name VARCHAR(200), available BOOLEAN DEFAULT true, description TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS hospital_facilities (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), hospital_id UUID REFERENCES hospitals(id), facility_name VARCHAR(200), facility_type VARCHAR(100), count INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS hospital_staff (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), hospital_id UUID REFERENCES hospitals(id), professional_id UUID REFERENCES professionals(id), position VARCHAR(200), department VARCHAR(100), joining_date DATE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE(hospital_id, professional_id));
CREATE INDEX IF NOT EXISTS idx_staff_hosp ON hospital_staff(hospital_id);

CREATE TABLE IF NOT EXISTS hospital_beds_availability (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), hospital_id UUID REFERENCES hospitals(id), bed_type VARCHAR(50), total_beds INT, available_beds INT, last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE(hospital_id, bed_type));

CREATE TABLE IF NOT EXISTS hospital_reviews (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), hospital_id UUID REFERENCES hospitals(id), reviewer_id UUID, rating INT CHECK (rating >= 1 AND rating <= 5), review_text TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS hospital_admins (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), hospital_id UUID REFERENCES hospitals(id), user_id UUID, admin_role VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE(hospital_id, user_id));

-- Seeds
INSERT INTO badge_definitions (badge_type, name, icon_url, description, criteria) VALUES ('verified_license', 'Verified License', '/badges/verified.png', 'License verified', 'Approved'), ('expert_endorsement', 'Expert', '/badges/expert.png', 'Expert rating', '10+ endorsements'), ('highly_rated', 'Highly Rated', '/badges/rating.png', 'Top rated', '4.8+ avg'), ('early_adopter', 'Early Adopter', '/badges/early.png', 'First month', 'Joined early'), ('mentor', 'Mentor', '/badges/mentor.png', 'Mentors', '50+ mentored') ON CONFLICT DO NOTHING;

INSERT INTO professionals (role, specialties, bio, location_district, average_rating, verification_status, is_available_for_work) VALUES ('doctor', ARRAY['Cardiology'], 'Cardiologist', 'Thiruvananthapuram', 4.8, 'verified', true), ('doctor', ARRAY['Orthopedics'], 'Joint specialist', 'Kochi', 4.6, 'verified', true), ('nurse', ARRAY['ICU','Emergency'], 'Trauma nurse', 'Thiruvananthapuram', 4.7, 'verified', true), ('pharmacist', ARRAY['Clinical'], 'Clinical pharmacist', 'Kochi', 4.5, 'verified', false), ('paramedic', ARRAY['Emergency'], 'Emergency tech', 'Thiruvananthapuram', 4.4, 'verified', true), ('lab_tech', ARRAY['Hematology','Biochemistry'], 'Lab tech', 'Kochi', 4.3, 'pending', false), ('physiotherapist', ARRAY['Sports','Orthopedic'], 'Sports physio', 'Thiruvananthapuram', 4.6, 'verified', true), ('dentist', ARRAY['Cosmetic','Pediatric'], 'Dental surgeon', 'Kochi', 4.5, 'verified', false), ('counselor', ARRAY['Mental Health'], 'Psychologist', 'Thiruvananthapuram', 4.7, 'verified', true), ('doctor', ARRAY['Pediatrics'], 'Child specialist', 'Kochi', 4.4, 'verified', false) ON CONFLICT DO NOTHING;

INSERT INTO hospitals (name_en, name_ml, district, beds_total, icu_beds, ccu_beds, general_beds, average_rating, is_verified, accreditations, website) VALUES ('AIMS Thiruvananthapuram', 'ഐഐഎംഎസ്', 'Thiruvananthapuram', 500, 50, 30, 420, 4.8, true, ARRAY['NABH','ISO 9001'], 'aims.edu.in'), ('Medical College Hospital', 'മെഡിക്കൽ കോളേജ്', 'Thiruvananthapuram', 800, 100, 50, 650, 4.7, true, ARRAY['Government'], 'mctrivandrum.ac.in'), ('VPS Lakeshore', 'വിപിഎസ്', 'Kochi', 300, 40, 20, 240, 4.6, true, ARRAY['NABH','JCI'], 'vpslakeshore.com'), ('Sunrise Hospital', 'സൺറൈസ്', 'Thiruvananthapuram', 200, 20, 10, 170, 4.4, false, ARRAY[], 'sunrisehospital.in'), ('Medcare Hospital', 'മെഡ്കെയർ', 'Kochi', 400, 50, 30, 320, 4.5, true, ARRAY['NABH'], 'medcarekochi.com') ON CONFLICT DO NOTHING;

INSERT INTO hospital_departments (hospital_id, department_name, specialty, staff_count) SELECT h.id, 'Cardiology', 'Cardiology', 15 FROM hospitals h WHERE h.name_en='AIMS Thiruvananthapuram' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO hospital_departments (hospital_id, department_name, specialty, staff_count) SELECT h.id, 'Orthopedics', 'Orthopedics', 12 FROM hospitals h WHERE h.name_en='Medical College Hospital' LIMIT 1 ON CONFLICT DO NOTHING;

INSERT INTO credentials (professional_id, cred_type, credential_name, credential_number, issue_date, expiry_date, issuing_body, verification_status) SELECT p.id, 'medical_license', 'Medical License', 'MCI'||LPAD((ROW_NUMBER() OVER (ORDER BY p.id))::TEXT, 6, '0'), '2015-06-15'::DATE, '2025-06-15'::DATE, 'MCI', 'verified' FROM professionals p WHERE p.role='doctor' ON CONFLICT DO NOTHING;

INSERT INTO hospital_beds_availability (hospital_id, bed_type, total_beds, available_beds) SELECT h.id, 'ICU', h.icu_beds, GREATEST(1, h.icu_beds - 5) FROM hospitals h ON CONFLICT DO NOTHING;
INSERT INTO hospital_beds_availability (hospital_id, bed_type, total_beds, available_beds) SELECT h.id, 'General', h.general_beds, GREATEST(10, h.general_beds - 50) FROM hospitals h ON CONFLICT DO NOTHING;
