/**
 * Prospeo.io provider
 *
 * Endpoints used:
 * - Email Finder:  POST /email-finder
 *
 * Docs: https://prospeo.io/api
 */
import type { EnrichmentProvider, EmailResult, PersonResult } from "../types.js";
export declare class ProspeoProvider implements EnrichmentProvider {
    name: string;
    private apiKey;
    constructor();
    isConfigured(): boolean;
    private headers;
    findEmail(name: string, domain: string): Promise<EmailResult | null>;
    enrichPerson(identifier: {
        email?: string;
        name?: string;
        company?: string;
    }): Promise<PersonResult | null>;
}
//# sourceMappingURL=prospeo.d.ts.map