/**
 * WhoisXML API client.
 *
 * Wraps the WhoisXML API endpoints for:
 * - WHOIS lookups
 * - Newly registered domain search
 *
 * Rate-limited to 1 request/second to stay within API limits.
 * Free tier: 500 credits/month.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WhoisRecord {
  domain: string;
  registrant_name: string | null;
  registrant_org: string | null;
  registrant_email: string | null;
  registrant_phone: string | null;
  registrant_country: string | null;
  registrant_state: string | null;
  registrant_city: string | null;
  creation_date: string | null;
  updated_date: string | null;
  expiration_date: string | null;
  name_servers: string[];
  registrar: string | null;
}

export interface NewlyRegisteredDomain {
  domain: string;
  registration_date: string;
  registrar: string | null;
  registrant_country: string | null;
}

// ---------------------------------------------------------------------------
// Rate limiter
// ---------------------------------------------------------------------------

class RateLimiter {
  private lastRequest = 0;
  private readonly minInterval: number;

  constructor(requestsPerSecond: number) {
    this.minInterval = 1000 / requestsPerSecond;
  }

  async wait(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequest;
    if (elapsed < this.minInterval) {
      await new Promise((resolve) => setTimeout(resolve, this.minInterval - elapsed));
    }
    this.lastRequest = Date.now();
  }
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export class WhoisXMLClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly rateLimiter: RateLimiter;

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl ?? "https://www.whoisxmlapi.com";
    this.rateLimiter = new RateLimiter(1); // 1 req/sec
  }

  // -------------------------------------------------------------------------
  // WHOIS Lookup
  // -------------------------------------------------------------------------

  async whoisLookup(domain: string): Promise<WhoisRecord> {
    await this.rateLimiter.wait();

    const url = new URL("/whoisserver/WhoisService", this.baseUrl);
    url.searchParams.set("apiKey", this.apiKey);
    url.searchParams.set("domainName", domain);
    url.searchParams.set("outputFormat", "JSON");

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`WHOIS lookup failed for ${domain}: ${res.status} ${res.statusText}`);
    }

    const data = await res.json() as Record<string, unknown>;
    const record = (data as Record<string, unknown>).WhoisRecord as Record<string, unknown> | undefined;

    if (!record) {
      return {
        domain,
        registrant_name: null,
        registrant_org: null,
        registrant_email: null,
        registrant_phone: null,
        registrant_country: null,
        registrant_state: null,
        registrant_city: null,
        creation_date: null,
        updated_date: null,
        expiration_date: null,
        name_servers: [],
        registrar: null,
      };
    }

    const registrant = (record.registrant ?? {}) as Record<string, unknown>;
    const registrarInfo = (record.registrarName ?? null) as string | null;

    // Name servers can come in different formats
    const nameServers: string[] = [];
    const nsRaw = record.nameServers as Record<string, unknown> | undefined;
    if (nsRaw && Array.isArray(nsRaw.hostNames)) {
      for (const ns of nsRaw.hostNames) {
        if (typeof ns === "string") nameServers.push(ns);
      }
    }

    return {
      domain: (record.domainName as string) ?? domain,
      registrant_name: (registrant.name as string) ?? null,
      registrant_org: (registrant.organization as string) ?? null,
      registrant_email: (registrant.email as string) ?? null,
      registrant_phone: (registrant.telephone as string) ?? null,
      registrant_country: (registrant.country as string) ?? null,
      registrant_state: (registrant.state as string) ?? null,
      registrant_city: (registrant.city as string) ?? null,
      creation_date: (record.createdDate as string) ?? null,
      updated_date: (record.updatedDate as string) ?? null,
      expiration_date: (record.expiresDate as string) ?? null,
      name_servers: nameServers,
      registrar: registrarInfo,
    };
  }

  // -------------------------------------------------------------------------
  // Newly Registered Domains
  // -------------------------------------------------------------------------

  async findNewRegistrations(
    keywords: string[],
    options?: {
      tlds?: string[];
      sinceDate?: string; // YYYY-MM-DD
      limit?: number;
    }
  ): Promise<NewlyRegisteredDomain[]> {
    await this.rateLimiter.wait();

    const sinceDate = options?.sinceDate ?? this.daysAgo(7);
    const limit = options?.limit ?? 100;

    // WhoisXML Newly Registered Domains API
    const url = new URL(
      "https://newly-registered-domains.whoisxmlapi.com/api/v2"
    );
    url.searchParams.set("apiKey", this.apiKey);
    url.searchParams.set("sinceDate", sinceDate);
    url.searchParams.set("mode", "keyword");
    url.searchParams.set("outputFormat", "JSON");

    // Add each keyword
    for (const kw of keywords) {
      url.searchParams.append("keyword", kw);
    }

    // Add TLD filters if specified
    const tlds = options?.tlds ?? ["com", "net", "org"];
    for (const tld of tlds) {
      url.searchParams.append("tld", tld);
    }

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(
        `New registration search failed: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json() as Record<string, unknown>;
    const domainsList = (data as Record<string, unknown>).domainsList as
      | Array<Record<string, unknown>>
      | undefined;

    if (!Array.isArray(domainsList)) {
      return [];
    }

    return domainsList.slice(0, limit).map((entry) => ({
      domain: (entry.domainName as string) ?? "",
      registration_date: sinceDate, // API groups by date; use sinceDate as approx
      registrar: null,
      registrant_country: null,
    }));
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  private daysAgo(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0]!;
  }
}
