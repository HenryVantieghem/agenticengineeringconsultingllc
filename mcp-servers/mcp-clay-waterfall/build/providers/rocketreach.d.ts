/**
 * RocketReach provider
 *
 * Endpoints used:
 * - Lookup Profile: POST /v2/api/lookupProfile
 * - Search:         POST /v2/api/search
 *
 * Docs: https://rocketreach.co/api/docs/
 */
import type { EnrichmentProvider, EmailResult, PhoneResult, PersonResult, DecisionMakerResult } from "../types.js";
export declare class RocketReachProvider implements EnrichmentProvider {
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
    findDecisionMakers(company: string, _domain: string, titles: string[]): Promise<DecisionMakerResult[]>;
}
//# sourceMappingURL=rocketreach.d.ts.map