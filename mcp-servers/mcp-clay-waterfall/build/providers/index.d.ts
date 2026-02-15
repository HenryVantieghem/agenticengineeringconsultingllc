/**
 * Provider registry — instantiates all providers and exposes
 * ordered arrays for each waterfall type.
 *
 * To add a new provider:
 * 1. Create src/providers/yourprovider.ts implementing EnrichmentProvider
 * 2. Import and instantiate it here
 * 3. Insert it into the relevant priority arrays
 */
import type { EnrichmentProvider } from "../types.js";
/** Email waterfall — order: SmtpVerifier ($0) > Hunter > Snov > Apollo > Prospeo > RocketReach > PDL */
export declare const emailProviders: EnrichmentProvider[];
/** Phone waterfall — order: Lusha > Apollo > RocketReach > Snov > PDL */
export declare const phoneProviders: EnrichmentProvider[];
/** Person enrichment waterfall — order: Apollo > PDL > RocketReach > Prospeo > Snov > Hunter */
export declare const personProviders: EnrichmentProvider[];
/** Company enrichment — order: Apollo > PDL > Hunter */
export declare const companyProviders: EnrichmentProvider[];
/** Decision-maker search — order: Apollo > Hunter > RocketReach > PDL > Snov */
export declare const decisionMakerProviders: EnrichmentProvider[];
/** Email verification — SmtpVerifier ($0) first, Hunter as paid fallback */
export declare const verificationProviders: EnrichmentProvider[];
export declare const allProviders: EnrichmentProvider[];
//# sourceMappingURL=index.d.ts.map