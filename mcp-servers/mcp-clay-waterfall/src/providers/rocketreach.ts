/**
 * RocketReach provider
 *
 * Endpoints used:
 * - Lookup Profile: POST /v2/api/lookupProfile
 * - Search:         POST /v2/api/search
 *
 * Docs: https://rocketreach.co/api/docs/
 */

import type {
  EnrichmentProvider,
  EmailResult,
  PhoneResult,
  PersonResult,
  DecisionMakerResult,
} from "../types.js";
import { fetchWithRetry, log } from "../waterfall.js";

const BASE = "https://api.rocketreach.co";

export class RocketReachProvider implements EnrichmentProvider {
  name = "rocketreach";
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.ROCKETREACH_API_KEY;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  private headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "Api-Key": this.apiKey!,
    };
  }

  // -----------------------------------------------------------------------
  // findEmail (lookupProfile)
  // -----------------------------------------------------------------------

  async findEmail(name: string, domain: string): Promise<EmailResult | null> {
    const res = await fetchWithRetry(`${BASE}/v2/api/lookupProfile`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        name,
        current_employer: domain,
      }),
    });

    if (!res.ok) {
      log("warn", `RocketReach lookupProfile HTTP ${res.status}`);
      return null;
    }

    const json = (await res.json()) as {
      emails?: Array<{ email?: string; smtp_valid?: string }>;
    };

    if (!json.emails?.length) return null;

    // Find first valid email
    const valid = json.emails.find((e) => e.smtp_valid === "valid");
    const best = valid ?? json.emails[0];

    if (!best.email) return null;

    return {
      email: best.email,
      verified: best.smtp_valid === "valid",
      confidence: best.smtp_valid === "valid" ? 90 : 50,
    };
  }

  // -----------------------------------------------------------------------
  // findPhone (lookupProfile)
  // -----------------------------------------------------------------------

  async findPhone(name: string, company: string): Promise<PhoneResult | null> {
    const res = await fetchWithRetry(`${BASE}/v2/api/lookupProfile`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        name,
        current_employer: company,
      }),
    });

    if (!res.ok) return null;

    const json = (await res.json()) as {
      phones?: Array<{ number?: string; type?: string }>;
    };

    if (!json.phones?.length) return null;

    const mobile = json.phones.find((p) => p.type === "mobile");
    const direct = json.phones.find((p) => p.type === "direct");
    const best = mobile ?? direct ?? json.phones[0];

    if (!best.number) return null;

    let phoneType: PhoneResult["type"] = "office";
    if (best.type === "mobile") phoneType = "mobile";
    else if (best.type === "direct") phoneType = "direct";

    return {
      phone: best.number,
      type: phoneType,
    };
  }

  // -----------------------------------------------------------------------
  // enrichPerson (lookupProfile)
  // -----------------------------------------------------------------------

  async enrichPerson(identifier: {
    email?: string;
    name?: string;
    company?: string;
  }): Promise<PersonResult | null> {
    const body: Record<string, string> = {};

    if (identifier.email) {
      body.email = identifier.email;
    } else if (identifier.name) {
      body.name = identifier.name;
      if (identifier.company) body.current_employer = identifier.company;
    } else {
      return null;
    }

    const res = await fetchWithRetry(`${BASE}/v2/api/lookupProfile`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) return null;

    const json = (await res.json()) as {
      name?: string;
      current_title?: string;
      current_employer?: string;
      linkedin_url?: string;
      city?: string;
      region?: string;
      country?: string;
      emails?: Array<{ email?: string; smtp_valid?: string }>;
      phones?: Array<{ number?: string }>;
    };

    if (!json.name) return null;

    const validEmail = json.emails?.find((e) => e.smtp_valid === "valid");

    return {
      name: json.name,
      email: validEmail?.email ?? json.emails?.[0]?.email ?? identifier.email ?? null,
      phone: json.phones?.[0]?.number ?? null,
      title: json.current_title ?? null,
      linkedin_url: json.linkedin_url ?? null,
      company: json.current_employer ?? identifier.company ?? null,
      location: [json.city, json.region, json.country].filter(Boolean).join(", ") || null,
    };
  }

  // -----------------------------------------------------------------------
  // findDecisionMakers (search)
  // -----------------------------------------------------------------------

  async findDecisionMakers(
    company: string,
    _domain: string,
    titles: string[],
  ): Promise<DecisionMakerResult[]> {
    const res = await fetchWithRetry(`${BASE}/v2/api/search`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        query: {
          current_employer: [company],
          current_title: titles,
        },
        page_size: 20,
      }),
    });

    if (!res.ok) return [];

    const json = (await res.json()) as {
      profiles?: Array<{
        name?: string;
        current_title?: string;
        emails?: Array<{ email?: string; smtp_valid?: string }>;
        linkedin_url?: string;
      }>;
    };

    if (!json.profiles?.length) return [];

    return json.profiles.map((p) => {
      const validEmail = p.emails?.find((e) => e.smtp_valid === "valid");
      return {
        name: p.name ?? "",
        title: p.current_title ?? "",
        email: validEmail?.email ?? p.emails?.[0]?.email ?? null,
        linkedin_url: p.linkedin_url ?? null,
        confidence: validEmail ? 90 : p.emails?.length ? 60 : 30,
      };
    });
  }
}
