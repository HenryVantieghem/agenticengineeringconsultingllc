/**
 * Snov.io provider
 *
 * Auth: OAuth client_credentials flow — uses SNOV_USER_ID + SNOV_API_KEY
 * to obtain a short-lived access token, which is then used for all calls.
 *
 * Endpoints used:
 * - Token:              POST /v1/oauth/access_token
 * - Email Finder:       POST /v1/get-emails-from-names
 * - Domain Search:      POST /v2/get-emails-from-domain
 * - Email Verifier:     POST /v1/get-emails-verification-status
 *
 * Docs: https://snov.io/knowledgebase/category/api/
 */
import type { EnrichmentProvider, EmailResult, PhoneResult, PersonResult, DecisionMakerResult } from "../types.js";
export declare class SnovProvider implements EnrichmentProvider {
    name: string;
    private userId;
    private apiKey;
    private accessToken;
    private tokenExpiry;
    constructor();
    isConfigured(): boolean;
    private getToken;
    private post;
    findEmail(name: string, domain: string): Promise<EmailResult | null>;
    findPhone(_name: string, _company: string): Promise<PhoneResult | null>;
    enrichPerson(identifier: {
        email?: string;
        name?: string;
        company?: string;
    }): Promise<PersonResult | null>;
    findDecisionMakers(_company: string, domain: string, titles: string[]): Promise<DecisionMakerResult[]>;
}
//# sourceMappingURL=snov.d.ts.map