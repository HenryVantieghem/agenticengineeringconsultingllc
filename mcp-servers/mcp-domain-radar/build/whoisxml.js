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
// Rate limiter
// ---------------------------------------------------------------------------
class RateLimiter {
    lastRequest = 0;
    minInterval;
    constructor(requestsPerSecond) {
        this.minInterval = 1000 / requestsPerSecond;
    }
    async wait() {
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
    apiKey;
    baseUrl;
    rateLimiter;
    constructor(apiKey, baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl ?? "https://www.whoisxmlapi.com";
        this.rateLimiter = new RateLimiter(1); // 1 req/sec
    }
    // -------------------------------------------------------------------------
    // WHOIS Lookup
    // -------------------------------------------------------------------------
    async whoisLookup(domain) {
        await this.rateLimiter.wait();
        const url = new URL("/whoisserver/WhoisService", this.baseUrl);
        url.searchParams.set("apiKey", this.apiKey);
        url.searchParams.set("domainName", domain);
        url.searchParams.set("outputFormat", "JSON");
        const res = await fetch(url.toString());
        if (!res.ok) {
            throw new Error(`WHOIS lookup failed for ${domain}: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        const record = data.WhoisRecord;
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
        const registrant = (record.registrant ?? {});
        const registrarInfo = (record.registrarName ?? null);
        // Name servers can come in different formats
        const nameServers = [];
        const nsRaw = record.nameServers;
        if (nsRaw && Array.isArray(nsRaw.hostNames)) {
            for (const ns of nsRaw.hostNames) {
                if (typeof ns === "string")
                    nameServers.push(ns);
            }
        }
        return {
            domain: record.domainName ?? domain,
            registrant_name: registrant.name ?? null,
            registrant_org: registrant.organization ?? null,
            registrant_email: registrant.email ?? null,
            registrant_phone: registrant.telephone ?? null,
            registrant_country: registrant.country ?? null,
            registrant_state: registrant.state ?? null,
            registrant_city: registrant.city ?? null,
            creation_date: record.createdDate ?? null,
            updated_date: record.updatedDate ?? null,
            expiration_date: record.expiresDate ?? null,
            name_servers: nameServers,
            registrar: registrarInfo,
        };
    }
    // -------------------------------------------------------------------------
    // Newly Registered Domains
    // -------------------------------------------------------------------------
    async findNewRegistrations(keywords, options) {
        await this.rateLimiter.wait();
        const sinceDate = options?.sinceDate ?? this.daysAgo(7);
        const limit = options?.limit ?? 100;
        // WhoisXML Newly Registered Domains API
        const url = new URL("https://newly-registered-domains.whoisxmlapi.com/api/v2");
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
            throw new Error(`New registration search failed: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        const domainsList = data.domainsList;
        if (!Array.isArray(domainsList)) {
            return [];
        }
        return domainsList.slice(0, limit).map((entry) => ({
            domain: entry.domainName ?? "",
            registration_date: sinceDate, // API groups by date; use sinceDate as approx
            registrar: null,
            registrant_country: null,
        }));
    }
    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------
    daysAgo(n) {
        const d = new Date();
        d.setDate(d.getDate() - n);
        return d.toISOString().split("T")[0];
    }
}
//# sourceMappingURL=whoisxml.js.map