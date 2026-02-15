/**
 * Core types for the waterfall enrichment MCP server.
 *
 * Every provider implements the EnrichmentProvider interface.
 * The waterfall runner iterates providers in priority order,
 * skipping any that are not configured (missing API key).
 */

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

export interface EmailResult {
  email: string;
  verified: boolean;
  confidence: number; // 0-100
}

export interface PhoneResult {
  phone: string;
  type: "mobile" | "direct" | "office";
}

export interface PersonResult {
  name: string | null;
  email: string | null;
  phone: string | null;
  title: string | null;
  linkedin_url: string | null;
  company: string | null;
  location: string | null;
}

export interface CompanyResult {
  name: string | null;
  domain: string;
  industry: string | null;
  employee_count: number | null;
  revenue_range: string | null;
  tech_stack: string[];
  email_pattern: string | null;
  social_links: Record<string, string>;
}

export interface DecisionMakerResult {
  name: string;
  title: string;
  email: string | null;
  linkedin_url: string | null;
  confidence: number;
}

export interface EmailVerificationResult {
  email: string;
  status: "valid" | "invalid" | "catch-all" | "unknown";
  score: number; // 0-100
}

// ---------------------------------------------------------------------------
// Provider interface
// ---------------------------------------------------------------------------

export interface EnrichmentProvider {
  name: string;

  /** Returns true if required API keys / config are present. */
  isConfigured(): boolean;

  /** Find an email address for a person at a domain. */
  findEmail?(name: string, domain: string): Promise<EmailResult | null>;

  /** Find a phone number for a person at a company. */
  findPhone?(name: string, company: string): Promise<PhoneResult | null>;

  /** Enrich a person by email or name+company. */
  enrichPerson?(identifier: { email?: string; name?: string; company?: string }): Promise<PersonResult | null>;

  /** Enrich a company by domain. */
  enrichCompany?(domain: string): Promise<CompanyResult | null>;

  /** Search for decision-makers at a company. */
  findDecisionMakers?(company: string, domain: string, titles: string[]): Promise<DecisionMakerResult[]>;

  /** Verify an email address. */
  verifyEmail?(email: string): Promise<EmailVerificationResult | null>;
}

// ---------------------------------------------------------------------------
// Waterfall output wrappers
// ---------------------------------------------------------------------------

export interface WaterfallHit<T> {
  result: T;
  provider: string;
}
