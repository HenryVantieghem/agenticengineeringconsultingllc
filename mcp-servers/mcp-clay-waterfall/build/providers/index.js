/**
 * Provider registry — instantiates all providers and exposes
 * ordered arrays for each waterfall type.
 *
 * To add a new provider:
 * 1. Create src/providers/yourprovider.ts implementing EnrichmentProvider
 * 2. Import and instantiate it here
 * 3. Insert it into the relevant priority arrays
 */
import { SmtpVerifierProvider } from "./smtp-verifier.js";
import { HunterProvider } from "./hunter.js";
import { SnovProvider } from "./snov.js";
import { ApolloProvider } from "./apollo.js";
import { ProspeoProvider } from "./prospeo.js";
import { RocketReachProvider } from "./rocketreach.js";
import { LushaProvider } from "./lusha.js";
import { PDLProvider } from "./pdl.js";
// ---------------------------------------------------------------------------
// Singleton instances
// ---------------------------------------------------------------------------
const smtpVerifier = new SmtpVerifierProvider();
const hunter = new HunterProvider();
const snov = new SnovProvider();
const apollo = new ApolloProvider();
const prospeo = new ProspeoProvider();
const rocketreach = new RocketReachProvider();
const lusha = new LushaProvider();
const pdl = new PDLProvider();
// ---------------------------------------------------------------------------
// Priority-ordered arrays for each enrichment type
// ---------------------------------------------------------------------------
/** Email waterfall — order: SmtpVerifier ($0) > Hunter > Snov > Apollo > Prospeo > RocketReach > PDL */
export const emailProviders = [
    smtpVerifier,
    hunter,
    snov,
    apollo,
    prospeo,
    rocketreach,
    pdl,
];
/** Phone waterfall — order: Lusha > Apollo > RocketReach > Snov > PDL */
export const phoneProviders = [
    lusha,
    apollo,
    rocketreach,
    snov,
    pdl,
];
/** Person enrichment waterfall — order: Apollo > PDL > RocketReach > Prospeo > Snov > Hunter */
export const personProviders = [
    apollo,
    pdl,
    rocketreach,
    prospeo,
    snov,
    hunter,
];
/** Company enrichment — order: Apollo > PDL > Hunter */
export const companyProviders = [
    apollo,
    pdl,
    hunter,
];
/** Decision-maker search — order: Apollo > Hunter > RocketReach > PDL > Snov */
export const decisionMakerProviders = [
    apollo,
    hunter,
    rocketreach,
    pdl,
    snov,
];
/** Email verification — SmtpVerifier ($0) first, Hunter as paid fallback */
export const verificationProviders = [
    smtpVerifier,
    hunter,
];
// ---------------------------------------------------------------------------
// All unique providers (for diagnostics)
// ---------------------------------------------------------------------------
export const allProviders = [
    smtpVerifier,
    hunter,
    snov,
    apollo,
    prospeo,
    rocketreach,
    lusha,
    pdl,
];
//# sourceMappingURL=index.js.map