/**
 * ATTOM Data API client — property details, valuations, owner info,
 * comparable sales, property search, and foreclosure data.
 *
 * Auth: `apikey` header.
 * Rate limit: 1 req/sec enforced via internal throttle.
 * Session-level cache (in-memory Map) to avoid redundant lookups.
 */
import type { AddressInput, ComparableSale, ForeclosureResult, OwnerInfo, PropertyDetails, PropertySummary, RentalEstimate, ValuationResult } from "./types.js";
export declare class AttomClient {
    private apiKey;
    private lastRequestTime;
    private cache;
    constructor(apiKey: string);
    /** Enforce 1 req/sec rate limit */
    private throttle;
    /** Build query string from address input */
    private buildAddressParams;
    /** Make an authenticated GET request to ATTOM API */
    private request;
    /** Get detailed property information */
    getPropertyDetails(input: AddressInput): Promise<PropertyDetails | null>;
    /** Get automated valuation model (AVM) data */
    getValuation(input: AddressInput): Promise<ValuationResult | null>;
    /** Get property owner information */
    getOwnerInfo(input: AddressInput): Promise<OwnerInfo | null>;
    /** Get comparable sales near a property */
    getComparableSales(input: AddressInput, radiusMiles?: number, monthsBack?: number, limit?: number): Promise<ComparableSale[]>;
    /** Search properties by location and criteria */
    searchProperties(criteria: {
        zipcode?: string;
        city?: string;
        state?: string;
        min_price?: number;
        max_price?: number;
        property_type?: string;
        min_beds?: number;
        min_sqft?: number;
        limit?: number;
    }): Promise<PropertySummary[]>;
    /** Get rental estimate for a property */
    getRentalEstimate(input: AddressInput & {
        bedrooms?: number;
        bathrooms?: number;
        sqft?: number;
        zipcode?: string;
    }): Promise<RentalEstimate | null>;
    /** Fallback rental estimate using the 1% rule (and variations) */
    private estimateRentFromValue;
    /** Search for foreclosure properties */
    searchForeclosures(criteria: {
        zipcode?: string;
        city?: string;
        state?: string;
        limit?: number;
    }): Promise<ForeclosureResult[]>;
    /** Check if the client is configured (has an API key) */
    isConfigured(): boolean;
}
//# sourceMappingURL=attom-client.d.ts.map