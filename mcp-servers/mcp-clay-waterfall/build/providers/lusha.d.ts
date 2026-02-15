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
import type { EnrichmentProvider, EmailResult, PhoneResult, PersonResult } from "../types.js";
export declare class LushaProvider implements EnrichmentProvider {
    name: string;
    private apiKey;
    constructor();
    isConfigured(): boolean;
    private headers;
    findEmail(name: string, domain: string): Promise<EmailResult | null>;
    findPhone(name: string, company: string): Promise<PhoneResult | null>;
    enrichPerson(identifier: {
        email?: string;
        name?: string;
        company?: string;
    }): Promise<PersonResult | null>;
}
//# sourceMappingURL=lusha.d.ts.map