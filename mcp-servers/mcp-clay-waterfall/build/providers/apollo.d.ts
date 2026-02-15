/**
 * Apollo.io provider
 *
 * Endpoints used:
 * - People Search:  POST /v1/mixed_people/search
 * - People Enrich:  POST /v1/people/match
 * - Org Enrich:     GET  /v1/organizations/enrich
 *
 * Docs: https://apolloio.github.io/apollo-api-docs/
 */
import type { EnrichmentProvider, EmailResult, PhoneResult, PersonResult, CompanyResult, DecisionMakerResult } from "../types.js";
export declare class ApolloProvider implements EnrichmentProvider {
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
//# sourceMappingURL=apollo.d.ts.map