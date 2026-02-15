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
export declare class WhoisXMLClient {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly rateLimiter;
    constructor(apiKey: string, baseUrl?: string);
    whoisLookup(domain: string): Promise<WhoisRecord>;
    findNewRegistrations(keywords: string[], options?: {
        tlds?: string[];
        sinceDate?: string;
        limit?: number;
    }): Promise<NewlyRegisteredDomain[]>;
    private daysAgo;
}
//# sourceMappingURL=whoisxml.d.ts.map