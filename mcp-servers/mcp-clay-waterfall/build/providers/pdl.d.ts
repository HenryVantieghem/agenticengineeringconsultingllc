/**
 * People Data Labs (PDL) provider — bonus enrichment source
 *
 * Endpoints used:
 * - Person Enrichment: GET /v5/person/enrich
 * - Company Enrichment: GET /v5/company/enrich
 *
 * Docs: https://docs.peopledatalabs.com/
 */
import type { EnrichmentProvider, EmailResult, PhoneResult, PersonResult, CompanyResult, DecisionMakerResult } from "../types.js";
export declare class PDLProvider implements EnrichmentProvider {
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
    enrichCompany(domain: string): Promise<CompanyResult | null>;
    findDecisionMakers(company: string, domain: string, titles: string[]): Promise<DecisionMakerResult[]>;
}
//# sourceMappingURL=pdl.d.ts.map