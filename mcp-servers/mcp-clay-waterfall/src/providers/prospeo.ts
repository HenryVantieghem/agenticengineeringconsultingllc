/**
 * Prospeo.io provider
 *
 * Endpoints used:
 * - Email Finder:  POST /email-finder
 *
 * Docs: https://prospeo.io/api
 */

import type {
  EnrichmentProvider,
  EmailResult,
  PersonResult,
} from "../types.js";
import { fetchWithRetry, log } from "../waterfall.js";

const BASE = "https://api.prospeo.io";

export class ProspeoProvider implements EnrichmentProvider {
  name = "prospeo.io";
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.PROSPEO_API_KEY;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  private headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "X-KEY": this.apiKey!,
    };
  }

  // -----------------------------------------------------------------------
  // findEmail
  // -----------------------------------------------------------------------

  async findEmail(name: string, domain: string): Promise<EmailResult | null> {
    const [firstName, ...rest] = name.trim().split(/\s+/);
    const lastName = rest.join(" ");

    const res = await fetchWithRetry(`${BASE}/email-finder`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        company: domain,
      }),
    });

    if (!res.ok) {
      log("warn", `Prospeo email-finder HTTP ${res.status}`);
      return null;
    }

    const json = (await res.json()) as {
      error?: boolean;
      response?: {
        email?: string;
        email_status?: string;
        confidence_score?: number;
      };
    };

    if (json.error) return null;

    const email = json.response?.email;
    if (!email) return null;

    return {
      email,
      verified: json.response?.email_status === "VALID",
      confidence: json.response?.confidence_score ?? 70,
    };
  }

  // -----------------------------------------------------------------------
  // enrichPerson
  // -----------------------------------------------------------------------

  async enrichPerson(identifier: {
    email?: string;
    name?: string;
    company?: string;
  }): Promise<PersonResult | null> {
    if (!identifier.email) return null;

    // Prospeo has an email-info endpoint
    const res = await fetchWithRetry(`${BASE}/email-info`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ email: identifier.email }),
    });

    if (!res.ok) return null;

    const json = (await res.json()) as {
      error?: boolean;
      response?: {
        name?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        title?: string;
        linkedin?: string;
        company_name?: string;
        location?: string;
        phone_number?: string;
      };
    };

    if (json.error || !json.response) return null;

    const r = json.response;
    return {
      name: r.name ?? ([r.first_name, r.last_name].filter(Boolean).join(" ") || null),
      email: r.email ?? identifier.email,
      phone: r.phone_number ?? null,
      title: r.title ?? null,
      linkedin_url: r.linkedin ?? null,
      company: r.company_name ?? identifier.company ?? null,
      location: r.location ?? null,
    };
  }
}
