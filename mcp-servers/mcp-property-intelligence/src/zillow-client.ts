/**
 * Zillow API client — backup/enrichment data source.
 *
 * Provides Zestimate data and property search as a fallback
 * when ATTOM data is unavailable or for cross-referencing.
 *
 * Uses the Zillow/Bridge API (RapidAPI-style) or direct endpoints.
 */

import type { PropertyDetails, RentalEstimate, ValuationResult } from "./types.js";

// ---------------------------------------------------------------------------
// Logging (stderr to keep MCP stdio clean)
// ---------------------------------------------------------------------------

function log(level: "info" | "warn" | "error", message: string, meta?: Record<string, unknown>): void {
  const entry = { ts: new Date().toISOString(), level, message, ...meta };
  process.stderr.write(JSON.stringify(entry) + "\n");
}

// ---------------------------------------------------------------------------
// Client class
// ---------------------------------------------------------------------------

const ZILLOW_BASE_URL = "https://zillow-com1.p.rapidapi.com";

export class ZillowClient {
  private apiKey: string;
  private cache = new Map<string, unknown>();

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // -------------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------------

  private async request<T>(path: string, params: URLSearchParams): Promise<T | null> {
    const cacheKey = `zillow:${path}?${params.toString()}`;
    if (this.cache.has(cacheKey)) {
      log("info", `Zillow cache hit: ${cacheKey}`);
      return this.cache.get(cacheKey) as T;
    }

    const url = `${ZILLOW_BASE_URL}${path}?${params.toString()}`;
    log("info", `Zillow request: ${url}`);

    try {
      const res = await fetch(url, {
        headers: {
          "X-RapidAPI-Key": this.apiKey,
          "X-RapidAPI-Host": "zillow-com1.p.rapidapi.com",
        },
      });

      if (!res.ok) {
        const body = await res.text();
        log("error", `Zillow API error: ${res.status}`, { body });
        return null;
      }

      const data = (await res.json()) as T;
      this.cache.set(cacheKey, data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      log("error", `Zillow fetch error: ${message}`);
      return null;
    }
  }

  // -------------------------------------------------------------------------
  // Public methods
  // -------------------------------------------------------------------------

  /** Get property details from Zillow */
  async getPropertyDetails(address: string): Promise<PropertyDetails | null> {
    const params = new URLSearchParams({ address });
    const data = await this.request<Record<string, unknown>>("/property", params);

    if (!data) return null;

    try {
      return {
        address: (data.address as string) ?? (data.streetAddress as string) ?? address,
        attom_id: null,
        bedrooms: (data.bedrooms as number) ?? null,
        bathrooms: (data.bathrooms as number) ?? null,
        sqft: (data.livingArea as number) ?? (data.livingAreaValue as number) ?? null,
        lot_size_sqft: (data.lotAreaValue as number) ?? (data.lotSize as number) ?? null,
        year_built: (data.yearBuilt as number) ?? null,
        property_type: (data.homeType as string) ?? (data.propertyTypeDimension as string) ?? null,
        stories: (data.stories as number) ?? null,
        garage: data.hasGarage != null ? Boolean(data.hasGarage) : null,
        pool: data.hasPool != null ? Boolean(data.hasPool) : null,
        construction_type: null,
        heating: (data.heatingSystem as string) ?? null,
        cooling: (data.coolingSystem as string) ?? null,
        roof_type: (data.roofType as string) ?? null,
        legal_description: null,
      };
    } catch (err) {
      log("error", `Error parsing Zillow property: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  }

  /** Get Zestimate valuation from Zillow */
  async getValuation(address: string): Promise<ValuationResult | null> {
    const params = new URLSearchParams({ address });
    const data = await this.request<Record<string, unknown>>("/property", params);

    if (!data) return null;

    try {
      const zestimate = (data.zestimate as number) ?? null;
      const rentZestimate = (data.rentZestimate as number) ?? null;
      const sqft = (data.livingArea as number) ?? null;

      return {
        address: (data.address as string) ?? address,
        estimated_value: zestimate,
        value_low: (data.zestimateLowPercent as number)
          ? zestimate ? Math.round(zestimate * (1 - (data.zestimateLowPercent as number) / 100)) : null
          : null,
        value_high: (data.zestimateHighPercent as number)
          ? zestimate ? Math.round(zestimate * (1 + (data.zestimateHighPercent as number) / 100)) : null
          : null,
        confidence_score: null,
        last_sale_price: (data.lastSoldPrice as number) ?? null,
        last_sale_date: (data.datePostedString as string) ?? null,
        price_per_sqft: zestimate && sqft ? Math.round(zestimate / sqft) : null,
        value_change_1yr: (data.oneYearForecast as number) ?? null,
        value_change_5yr: null,
      };
    } catch (err) {
      log("error", `Error parsing Zillow valuation: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  }

  /** Get rental estimate from Zillow rent Zestimate */
  async getRentalEstimate(address: string): Promise<RentalEstimate | null> {
    const params = new URLSearchParams({ address });
    const data = await this.request<Record<string, unknown>>("/property", params);

    if (!data) return null;

    try {
      const rentZestimate = (data.rentZestimate as number) ?? null;
      const zestimate = (data.zestimate as number) ?? null;

      if (!rentZestimate) return null;

      return {
        estimated_rent_monthly: rentZestimate,
        rent_low: Math.round(rentZestimate * 0.9),
        rent_high: Math.round(rentZestimate * 1.1),
        cap_rate_estimate: zestimate
          ? Math.round(((rentZestimate * 12) / zestimate) * 10000) / 10000
          : null,
        gross_yield: zestimate
          ? Math.round(((rentZestimate * 12) / zestimate) * 10000) / 10000
          : null,
        nearby_avg_rent: null,
      };
    } catch (err) {
      log("error", `Error parsing Zillow rental: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  }

  /** Check if the client is configured */
  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }
}
