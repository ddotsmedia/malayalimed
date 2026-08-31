-- Refill requests (F3). Additive on prescription_refills (0042).
ALTER TABLE prescription_refills ADD COLUMN IF NOT EXISTS reason text;
