-- Appointment reminder preferences (F2). New table.
CREATE TABLE IF NOT EXISTS reminder_preferences (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid NOT NULL UNIQUE REFERENCES users(id),
  sms_enabled boolean DEFAULT true,
  email_enabled boolean DEFAULT true,
  whatsapp_enabled boolean DEFAULT false,
  inapp_enabled boolean DEFAULT true,
  quiet_hours_start time,
  quiet_hours_end time,
  reminder_hours_before int DEFAULT 24,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- reminded marker on appointments (additive) for the cron stub.
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reminded_at timestamptz;
