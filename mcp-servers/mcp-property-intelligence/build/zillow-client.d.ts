/**
 * Zillow API client — backup/enrichment data source.
 *
 * Provides Zestimate data and property search as a fallback
 * when ATTOM data is unavailable or for cross-referencing.
 *
 * Uses the Zillow/Bridge API (RapidAPI-style) or direct endpoints.
 */
import type { PropertyDetails, RentalEstimate, ValuationResult } from "./types.js";
export declare class ZillowClient {
    private apiKey;
    private cache;
    constructor(apiKey: string);
    private request;
    /** Get property details from Zillow */
    getPropertyDetails(address: string): Promise<PropertyDetails | null>;
    /** Get Zestimate valuation from Zillow */
    getValuation(address: string): Promise<ValuationResult | null>;
    /** Get rental estimate from Zillow rent Zestimate */
    getRentalEstimate(address: string): Promise<RentalEstimate | null>;
    /** Check if the client is configured */
    isConfigured(): boolean;
}
//# sourceMappingURL=zillow-client.d.ts.map