/**
 * Hunter.io provider
 *
 * Endpoints used:
 * - Email Finder:       GET /v2/email-finder
 * - Email Verifier:     GET /v2/email-verifier
 * - Domain Search:      GET /v2/domain-search
 * - Email Count:        GET /v2/email-count  (no auth needed)
 *
 * Docs: https://hunter.io/api-documentation/v2
 */
import type { EnrichmentProvider, EmailResult, PersonResult, CompanyResult, DecisionMakerResult, EmailVerificationResult } from "../types.js";
export declare class HunterProvider implements EnrichmentProvider {
    name: string;
    private apiKey;
    constructor();
    isConfigured(): boolean;
    findEmail(name: string, domain: string): Promise<EmailResult | null>;
    enrichPerson(identifier: {
        email?: string;
        name?: string;
        company?: string;
    }): Promise<PersonResult | null>;
    enrichCompany(domain: string): Promise<CompanyResult | null>;
    findDecisionMakers(_company: string, domain: string, titles: string[]): Promise<DecisionMakerResult[]>;
    verifyEmail(email: string): Promise<EmailVerificationResult | null>;
}
//# sourceMappingURL=hunter.d.ts.map