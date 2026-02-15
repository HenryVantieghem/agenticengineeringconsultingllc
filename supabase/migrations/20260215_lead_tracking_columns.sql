-- V3 Lead Tracking Columns
-- Adds email verification, contact status, follow-up tracking, notes, and exclusion fields
-- All columns use IF NOT EXISTS / exception handling for idempotency

-- Email verification tracking
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email_verification_source TEXT;

-- Contact status tracking
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contacted_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_status TEXT DEFAULT 'pending';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS follow_up_stage TEXT DEFAULT 'initial';

-- Notes and personalization
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS linkedin_post_hook TEXT;

-- Exclusion tracking
ALTER TABLE leads ADD COLUMN IF NOT EXISTS excluded_reason TEXT;

-- RLS policy for clients to update their own lead status (notes, contact_status, etc.)
DO $$ BEGIN
    CREATE POLICY "Client can update own lead status" ON leads
        FOR UPDATE USING (
            client_id IN (
                SELECT id FROM clients
                WHERE slug = (auth.jwt()->'user_metadata'->>'client_id')
            )
        )
        WITH CHECK (
            client_id IN (
                SELECT id FROM clients
                WHERE slug = (auth.jwt()->'user_metadata'->>'client_id')
            )
        );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
