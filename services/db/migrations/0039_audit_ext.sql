-- Additive: enrich existing audit_logs (0018) for the admin audit page.
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS ip_address varchar(45);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS user_agent text;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS old_value jsonb;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS new_value jsonb;
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs (actor_id);
