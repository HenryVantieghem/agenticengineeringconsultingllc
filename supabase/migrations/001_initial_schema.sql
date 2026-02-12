-- ============================================================
-- 001_initial_schema.sql
-- Agentic Engineering Consulting — Initial Database Schema
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- clients: one row per Agentic Engineering client
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  industry text,
  context jsonb DEFAULT '{}',
  recipients text[] DEFAULT '{}',
  calendly_url text,
  accent_color text DEFAULT '#E8533F',
  created_at timestamptz DEFAULT now()
);

-- leads: prospects found for each client
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text,
  title text,
  company text,
  region text,
  icp_segment text,
  fit_score int CHECK (fit_score BETWEEN 1 AND 10),
  website_url text,
  source text,
  created_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- outreach_packages: AI-generated outreach per lead
CREATE TABLE outreach_packages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  prospect_brief jsonb,
  cold_email jsonb,
  followup_day3 jsonb,
  followup_day7 jsonb,
  followup_day14 jsonb,
  sales_script jsonb,
  linkedin_message text,
  created_at timestamptz DEFAULT now()
);

-- briefings: daily HTML briefing emails
CREATE TABLE briefings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  html_content text,
  total_leads int,
  avg_fit_score numeric(3,1),
  trigger_events jsonb DEFAULT '[]',
  sent_to text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- trigger_events: daily news/industry triggers
CREATE TABLE trigger_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  event_summary text NOT NULL,
  icp_segment text,
  email_hook text,
  urgency_score int CHECK (urgency_score BETWEEN 1 AND 10),
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_leads_client_id ON leads(client_id);
CREATE INDEX idx_leads_created_date ON leads(created_date);
CREATE INDEX idx_leads_fit_score ON leads(fit_score DESC);
CREATE INDEX idx_outreach_lead_id ON outreach_packages(lead_id);
CREATE INDEX idx_briefings_client_id ON briefings(client_id);
CREATE INDEX idx_briefings_date ON briefings(date DESC);
CREATE INDEX idx_trigger_events_client_id ON trigger_events(client_id);
CREATE INDEX idx_trigger_events_date ON trigger_events(date DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_events ENABLE ROW LEVEL SECURITY;

-- Clients: users see only their own client
CREATE POLICY "Users see own client" ON clients
  FOR SELECT USING (id::text = auth.jwt()->>'client_id');

-- Leads: users see only leads for their client
CREATE POLICY "Users see own leads" ON leads
  FOR SELECT USING (client_id::text = auth.jwt()->>'client_id');

-- Outreach: users see outreach for their client's leads
CREATE POLICY "Users see own outreach" ON outreach_packages
  FOR SELECT USING (
    lead_id IN (SELECT id FROM leads WHERE client_id::text = auth.jwt()->>'client_id')
  );

-- Briefings: users see only their client's briefings
CREATE POLICY "Users see own briefings" ON briefings
  FOR SELECT USING (client_id::text = auth.jwt()->>'client_id');

-- Trigger events: users see only their client's events
CREATE POLICY "Users see own trigger events" ON trigger_events
  FOR SELECT USING (client_id::text = auth.jwt()->>'client_id');

-- Service role (Henry's Claude Code) can do everything
CREATE POLICY "Service role full access clients" ON clients FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access leads" ON leads FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access outreach" ON outreach_packages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access briefings" ON briefings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access trigger_events" ON trigger_events FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- SEED DATA — SYBA as first client
-- ============================================================

INSERT INTO clients (slug, name, industry, context, recipients, calendly_url, accent_color)
VALUES (
  'syba',
  'SYBA',
  'Cybersecurity',
  '{
    "company": "SYBA (syba.io)",
    "tagline": "Your Trusted Cybersecurity Solution",
    "ceo": "Brigitte Vantieghem LL.M.",
    "hq": "Belgium / US operations",
    "recognition": "Only cybersecurity company chosen for PwC Belgium Scale-up Track in Defence & Resilience",
    "partnerships": ["Chubb ($5M insurance)", "Tokio Marine Highland", "Jencap Group (exclusive HNWI distribution)", "PwC Belgium (Scale-up Track)"],
    "products": ["SYBA App", "Router Security", "24/7 Cyber Security Team", "Cyber Insurance ($5M)", "Training Plan", "Desktop Application"],
    "differentiator": "Only platform combining prevention app + 24/7 human support + $5M insurance + training + top-tier underwriters",
    "icp_segments": ["Insurance Brokers", "Family Offices", "Corporate HR/Benefits", "Law Firms", "Wealth Managers", "MSPs"],
    "regions": {
      "belgium": {"leads_per_day": 20, "partnership_emphasis": "PwC Belgium", "language": "GDPR, NIS2, EU-regulatory-aware"},
      "europe": {"leads_per_day": 10, "partnership_emphasis": "Tokio Marine/Chubb", "language": "GDPR, cross-border protection"},
      "usa": {"leads_per_day": 10, "partnership_emphasis": "Jencap/Chubb", "language": "ROI-focused, insurance-value-driven"}
    },
    "calendly": "https://calendly.com/with-francis-at-syba-io/15min",
    "website": "https://www.syba.io"
  }'::jsonb,
  ARRAY['brigittev@syba.io', 'francis@syba.io'],
  'https://calendly.com/with-francis-at-syba-io/15min',
  '#e94560'
);
