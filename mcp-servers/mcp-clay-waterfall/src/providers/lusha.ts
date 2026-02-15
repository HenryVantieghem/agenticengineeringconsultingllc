/**
 * Lusha provider
 *
 * Primarily used for phone number lookups (Lusha's strength).
 *
 * Endpoints used:
 * - Person Lookup: GET /person
 *
 * Docs: https://www.lusha.com/docs/
 */

import type {
  EnrichmentProvider,
  EmailResult,
  PhoneResult,
  PersonResult,
} from "../types.js";
import { fetchWithRetry, log } from "../waterfall.js";

const BASE = "https://api.lusha.com";

export class LushaProvider implements EnrichmentProvider {
  name = "lusha";
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.LUSHA_API_KEY;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  private headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "api_key": this.apiKey!,
    };
  }

  // -----------------------------------------------------------------------
  // findEmail
  // -----------------------------------------------------------------------

  async findEmail(name: string, domain: string): Promise<EmailResult | null> {
    const [firstName, ...rest] = name.trim().split(/\s+/);
    const lastName = rest.join(" ");

    const params = new URLSearchParams({
      firstName,
      lastName,
      company: domain,
    });

    const res = await fetchWithRetry(`${BASE}/person?${params}`, {
      headers: this.headers(),
    });

    if (!res.ok) {
      log("warn", `Lusha person HTTP ${res.status}`);
      return null;
    }

    const json = (await res.json()) as {
      data?: {
        emailAddresses?: Array<{
          email?: string;
          type?: string;
        }>;
      };
    };

    const emails = json.data?.emailAddresses;
    if (!emails?.length) return null;

    const best = emails[0];
    if (!best.email) return null;

    return {
      email: best.email,
      verified: true, // Lusha pre-verifies
      confidence: 85,
    };
  }

  // -----------------------------------------------------------------------
  // findPhone (Lusha's primary strength)
  // -----------------------------------------------------------------------

  async findPhone(name: string, company: string): Promise<PhoneResult | null> {
    const [firstName, ...rest] = name.trim().split(/\s+/);
    const lastName = rest.join(" ");

    const params = new URLSearchParams({
      firstName,
      lastName,
      company,
    });

    const res = await fetchWithRetry(`${BASE}/person?${params}`, {
      headers: this.headers(),
    });

    if (!res.ok) return null;

    const json = (await res.json()) as {
      data?: {
        phoneNumbers?: Array<{
          internationalNumber?: string;
          type?: string;
        }>;
      };
    };

    const phones = json.data?.phoneNumbers;
    if (!phones?.length) return null;

    const mobile = phones.find((p) => p.type === "mobile");
    const direct = phones.find((p) => p.type === "direct");
    const best = mobile ?? direct ?? phones[0];

    if (!best.internationalNumber) return null;

    let phoneType: PhoneResult["type"] = "office";
    if (best.type === "mobile") phoneType = "mobile";
    else if (best.type === "direct") phoneType = "direct";

    return {
      phone: best.internationalNumber,
      type: phoneType,
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
    if (!identifier.name) return null;

    const [firstName, ...rest] = identifier.name.trim().split(/\s+/);
    const lastName = rest.join(" ");

    const params = new URLSearchParams({
      firstName,
      lastName,
    });
    if (identifier.company) params.set("company", identifier.company);

    const res = await fetchWithRetry(`${BASE}/person?${params}`, {
      headers: this.headers(),
    });

    if (!res.ok) return null;

    const json = (await res.json()) as {
      data?: {
        firstName?: string;
        lastName?: string;
        emailAddresses?: Array<{ email?: string }>;
        phoneNumbers?: Array<{ internationalNumber?: string }>;
        jobTitle?: string;
        linkedinProfile?: string;
        company?: { name?: string };
        location?: { city?: string; country?: string };
      };
    };

    const d = json.data;
    if (!d) return null;

    return {
      name: [d.firstName, d.lastName].filter(Boolean).join(" ") || identifier.name,
      email: d.emailAddresses?.[0]?.email ?? identifier.email ?? null,
      phone: d.phoneNumbers?.[0]?.internationalNumber ?? null,
      title: d.jobTitle ?? null,
      linkedin_url: d.linkedinProfile ?? null,
      company: d.company?.name ?? identifier.company ?? null,
      location: [d.location?.city, d.location?.country].filter(Boolean).join(", ") || null,
    };
  }
}
