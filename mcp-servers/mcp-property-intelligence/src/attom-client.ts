/**
 * ATTOM Data API client — property details, valuations, owner info,
 * comparable sales, property search, and foreclosure data.
 *
 * Auth: `apikey` header.
 * Rate limit: 1 req/sec enforced via internal throttle.
 * Session-level cache (in-memory Map) to avoid redundant lookups.
 */

import type {
  AddressInput,
  ComparableSale,
  ForeclosureResult,
  OwnerInfo,
  PropertyDetails,
  PropertySummary,
  RentalEstimate,
  ValuationResult,
} from "./types.js";

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

const BASE_URL = "https://api.gateway.attomdata.com";

export class AttomClient {
  private apiKey: string;
  private lastRequestTime = 0;
  private cache = new Map<string, unknown>();

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // -------------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------------

  /** Enforce 1 req/sec rate limit */
  private async throttle(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < 1000) {
      await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
    }
    this.lastRequestTime = Date.now();
  }

  /** Build query string from address input */
  private buildAddressParams(input: AddressInput): URLSearchParams {
    const params = new URLSearchParams();

    if (input.attom_id) {
      params.set("attomid", String(input.attom_id));
    } else {
      if (input.address) {
        // ATTOM expects address1 (street) and address2 (city, state zip)
        params.set("address1", input.address);

        if (input.city && input.state) {
          const address2Parts = [input.city, input.state];
          if (input.zip) address2Parts.push(input.zip);
          params.set("address2", address2Parts.join(", "));
        } else if (input.zip) {
          params.set("address2", input.zip);
        }
      }
    }

    return params;
  }

  /** Make an authenticated GET request to ATTOM API */
  private async request<T>(path: string, params: URLSearchParams): Promise<T | null> {
    const cacheKey = `${path}?${params.toString()}`;
    if (this.cache.has(cacheKey)) {
      log("info", `Cache hit: ${cacheKey}`);
      return this.cache.get(cacheKey) as T;
    }

    await this.throttle();

    const url = `${BASE_URL}${path}?${params.toString()}`;
    log("info", `ATTOM request: ${url}`);

    try {
      const res = await fetch(url, {
        headers: {
          apikey: this.apiKey,
          Accept: "application/json",
        },
      });

      if (res.status === 429) {
        log("warn", "Rate limited by ATTOM API, waiting 2s and retrying");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return this.request<T>(path, params);
      }

      if (!res.ok) {
        const body = await res.text();
        log("error", `ATTOM API error: ${res.status}`, { body });
        return null;
      }

      const data = (await res.json()) as T;
      this.cache.set(cacheKey, data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      log("error", `ATTOM fetch error: ${message}`);
      return null;
    }
  }

  // -------------------------------------------------------------------------
  // Public methods
  // -------------------------------------------------------------------------

  /** Get detailed property information */
  async getPropertyDetails(input: AddressInput): Promise<PropertyDetails | null> {
    const params = this.buildAddressParams(input);
    const data = await this.request<Record<string, unknown>>(
      "/propertyapi/v1.0.0/property/detail",
      params,
    );

    if (!data) return null;

    try {
      // ATTOM nests property data under property[0]
      const properties = (data as Record<string, unknown>).property as Record<string, unknown>[] | undefined;
      const prop = properties?.[0] as Record<string, unknown> | undefined;
      if (!prop) return null;

      const address = prop.address as Record<string, unknown> | undefined;
      const building = prop.building as Record<string, unknown> | undefined;
      const lot = prop.lot as Record<string, unknown> | undefined;
      const summary = prop.summary as Record<string, unknown> | undefined;
      const utilities = prop.utilities as Record<string, unknown> | undefined;
      const buildingSize = building?.size as Record<string, unknown> | undefined;
      const rooms = building?.rooms as Record<string, unknown> | undefined;
      const construction = building?.construction as Record<string, unknown> | undefined;
      const parking = building?.parking as Record<string, unknown> | undefined;
      const lotSize = lot?.lotSize as Record<string, unknown> | undefined;

      const fullAddress = [
        address?.oneLine ?? address?.line1,
      ].filter(Boolean).join(", ");

      return {
        address: (fullAddress as string) || input.address || "Unknown",
        attom_id: (prop.identifier as Record<string, unknown>)?.attomId as number ?? null,
        bedrooms: (rooms?.bedrooms as number) ?? null,
        bathrooms: (rooms?.bathsFull as number) ?? null,
        sqft: (buildingSize?.livingSize as number) ?? (buildingSize?.universalSize as number) ?? null,
        lot_size_sqft: (lotSize?.lotSize1 as number) ?? null,
        year_built: (summary?.yearBuilt as number) ?? null,
        property_type: (summary?.propType as string) ?? (summary?.propSubType as string) ?? null,
        stories: ((building?.summary as Record<string, unknown> | undefined)?.stories as number) ?? (construction?.stories as number) ?? null,
        garage: parking?.garage != null ? Boolean(parking.garage) : null,
        pool: (summary?.pool as boolean) ?? null,
        construction_type: (construction?.constructionType as string) ?? null,
        heating: (utilities?.heatingType as string) ?? null,
        cooling: (utilities?.coolingType as string) ?? null,
        roof_type: (construction?.roofType as string) ?? null,
        legal_description: (lot?.legalDescription as string) ?? (summary?.legal1 as string) ?? null,
      };
    } catch (err) {
      log("error", `Error parsing property details: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  }

  /** Get automated valuation model (AVM) data */
  async getValuation(input: AddressInput): Promise<ValuationResult | null> {
    const params = this.buildAddressParams(input);
    const data = await this.request<Record<string, unknown>>(
      "/propertyapi/v1.0.0/avm/detail",
      params,
    );

    if (!data) return null;

    try {
      const properties = (data as Record<string, unknown>).property as Record<string, unknown>[] | undefined;
      const prop = properties?.[0] as Record<string, unknown> | undefined;
      if (!prop) return null;

      const address = prop.address as Record<string, unknown> | undefined;
      const avm = prop.avm as Record<string, unknown> | undefined;
      const avmAmount = avm?.amount as Record<string, unknown> | undefined;
      const sale = prop.sale as Record<string, unknown> | undefined;
      const saleAmount = sale?.amount as Record<string, unknown> | undefined;
      const building = prop.building as Record<string, unknown> | undefined;
      const buildingSize = building?.size as Record<string, unknown> | undefined;

      const estimatedValue = (avmAmount?.value as number) ?? null;
      const sqft = (buildingSize?.livingSize as number) ?? null;

      return {
        address: (address?.oneLine as string) ?? input.address ?? "Unknown",
        estimated_value: estimatedValue,
        value_low: (avmAmount?.low as number) ?? null,
        value_high: (avmAmount?.high as number) ?? null,
        confidence_score: (avm?.confidence as number) ?? (avm?.confidenceScore as number) ?? null,
        last_sale_price: (saleAmount?.saleAmt as number) ?? null,
        last_sale_date: (sale?.saleTransDate as string) ?? null,
        price_per_sqft: estimatedValue && sqft ? Math.round(estimatedValue / sqft) : null,
        value_change_1yr: (avm?.changePercent1yr as number) ?? null,
        value_change_5yr: (avm?.changePercent5yr as number) ?? null,
      };
    } catch (err) {
      log("error", `Error parsing valuation: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  }

  /** Get property owner information */
  async getOwnerInfo(input: AddressInput): Promise<OwnerInfo | null> {
    // Owner data comes from the property detail endpoint
    const params = this.buildAddressParams(input);
    const data = await this.request<Record<string, unknown>>(
      "/propertyapi/v1.0.0/property/detail",
      params,
    );

    if (!data) return null;

    try {
      const properties = (data as Record<string, unknown>).property as Record<string, unknown>[] | undefined;
      const prop = properties?.[0] as Record<string, unknown> | undefined;
      if (!prop) return null;

      const assessment = prop.assessment as Record<string, unknown> | undefined;
      const owner = assessment?.owner as Record<string, unknown> | undefined;
      const sale = prop.sale as Record<string, unknown> | undefined;
      const saleAmount = sale?.amount as Record<string, unknown> | undefined;
      const mailingAddress = owner?.mailingAddress ?? prop.address as Record<string, unknown> | undefined;
      const summary = prop.summary as Record<string, unknown> | undefined;

      // Determine owner type from name patterns
      const ownerName = (owner?.owner1 as Record<string, unknown>)?.fullName as string
        ?? (owner?.absenteeOwnerStatus as string)
        ?? null;

      let ownerType: "individual" | "corporate" | "trust" | null = null;
      if (ownerName) {
        const upper = ownerName.toUpperCase();
        if (upper.includes("LLC") || upper.includes("INC") || upper.includes("CORP") || upper.includes("CO")) {
          ownerType = "corporate";
        } else if (upper.includes("TRUST") || upper.includes("ESTATE")) {
          ownerType = "trust";
        } else {
          ownerType = "individual";
        }
      }

      // Calculate ownership length
      const purchaseDateStr = (sale?.saleTransDate as string) ?? null;
      let ownershipYears: number | null = null;
      if (purchaseDateStr) {
        const purchaseDate = new Date(purchaseDateStr);
        const now = new Date();
        ownershipYears = Math.round(
          ((now.getTime() - purchaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) * 10,
        ) / 10;
      }

      return {
        owner_name: ownerName,
        owner_type: ownerType,
        mailing_address: (mailingAddress as Record<string, unknown>)?.oneLine as string ?? null,
        owner_occupied: (summary?.absenteeInd as string) === "O" || (owner?.absenteeOwnerStatus as string) === "O",
        ownership_length_years: ownershipYears,
        purchase_price: (saleAmount?.saleAmt as number) ?? null,
        purchase_date: purchaseDateStr,
      };
    } catch (err) {
      log("error", `Error parsing owner info: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  }

  /** Get comparable sales near a property */
  async getComparableSales(
    input: AddressInput,
    radiusMiles = 1,
    monthsBack = 6,
    limit = 10,
  ): Promise<ComparableSale[]> {
    const params = this.buildAddressParams(input);
    params.set("searchType", "proximity");
    params.set("radius", String(radiusMiles));
    params.set("monthsBack", String(monthsBack));
    params.set("limit", String(limit));

    const data = await this.request<Record<string, unknown>>(
      "/propertyapi/v1.0.0/salescomparables/detail",
      params,
    );

    if (!data) return [];

    try {
      const properties = (data as Record<string, unknown>).property as Record<string, unknown>[] | undefined;
      if (!properties || !Array.isArray(properties)) return [];

      return properties.map((prop) => {
        const address = prop.address as Record<string, unknown> | undefined;
        const sale = prop.sale as Record<string, unknown> | undefined;
        const saleAmount = sale?.amount as Record<string, unknown> | undefined;
        const building = prop.building as Record<string, unknown> | undefined;
        const buildingSize = building?.size as Record<string, unknown> | undefined;
        const rooms = building?.rooms as Record<string, unknown> | undefined;
        const proximity = prop.proximity as Record<string, unknown> | undefined;

        const salePrice = (saleAmount?.saleAmt as number) ?? null;
        const sqft = (buildingSize?.livingSize as number) ?? null;

        return {
          address: (address?.oneLine as string) ?? "Unknown",
          sale_price: salePrice,
          sale_date: (sale?.saleTransDate as string) ?? null,
          sqft,
          price_per_sqft: salePrice && sqft ? Math.round(salePrice / sqft) : null,
          bedrooms: (rooms?.bedrooms as number) ?? null,
          bathrooms: (rooms?.bathsFull as number) ?? null,
          distance_miles: (proximity?.distance as number) ?? null,
          similarity_score: (proximity?.similarityScore as number) ?? null,
        };
      }).slice(0, limit);
    } catch (err) {
      log("error", `Error parsing comparable sales: ${err instanceof Error ? err.message : String(err)}`);
      return [];
    }
  }

  /** Search properties by location and criteria */
  async searchProperties(criteria: {
    zipcode?: string;
    city?: string;
    state?: string;
    min_price?: number;
    max_price?: number;
    property_type?: string;
    min_beds?: number;
    min_sqft?: number;
    limit?: number;
  }): Promise<PropertySummary[]> {
    const params = new URLSearchParams();

    if (criteria.zipcode) params.set("postalcode", criteria.zipcode);
    if (criteria.city) params.set("cityName", criteria.city);
    if (criteria.state) params.set("stateCode", criteria.state);
    if (criteria.min_price) params.set("minAVMValue", String(criteria.min_price));
    if (criteria.max_price) params.set("maxAVMValue", String(criteria.max_price));
    if (criteria.property_type) params.set("propertyType", criteria.property_type);
    if (criteria.min_beds) params.set("minBeds", String(criteria.min_beds));
    if (criteria.min_sqft) params.set("minLivingSize", String(criteria.min_sqft));

    const limit = criteria.limit ?? 20;
    params.set("pageSize", String(limit));

    const data = await this.request<Record<string, unknown>>(
      "/propertyapi/v1.0.0/property/snapshot",
      params,
    );

    if (!data) return [];

    try {
      const properties = (data as Record<string, unknown>).property as Record<string, unknown>[] | undefined;
      if (!properties || !Array.isArray(properties)) return [];

      return properties.map((prop) => {
        const address = prop.address as Record<string, unknown> | undefined;
        const building = prop.building as Record<string, unknown> | undefined;
        const buildingSize = building?.size as Record<string, unknown> | undefined;
        const rooms = building?.rooms as Record<string, unknown> | undefined;
        const summary = prop.summary as Record<string, unknown> | undefined;
        const avm = prop.avm as Record<string, unknown> | undefined;
        const avmAmount = avm?.amount as Record<string, unknown> | undefined;
        const sale = prop.sale as Record<string, unknown> | undefined;
        const saleAmount = sale?.amount as Record<string, unknown> | undefined;
        const identifier = prop.identifier as Record<string, unknown> | undefined;

        return {
          address: (address?.oneLine as string) ?? "Unknown",
          attom_id: (identifier?.attomId as number) ?? null,
          bedrooms: (rooms?.bedrooms as number) ?? null,
          bathrooms: (rooms?.bathsFull as number) ?? null,
          sqft: (buildingSize?.livingSize as number) ?? null,
          year_built: (summary?.yearBuilt as number) ?? null,
          property_type: (summary?.propType as string) ?? null,
          estimated_value: (avmAmount?.value as number) ?? null,
          last_sale_price: (saleAmount?.saleAmt as number) ?? null,
          last_sale_date: (sale?.saleTransDate as string) ?? null,
        };
      }).slice(0, limit);
    } catch (err) {
      log("error", `Error parsing property search: ${err instanceof Error ? err.message : String(err)}`);
      return [];
    }
  }

  /** Get rental estimate for a property */
  async getRentalEstimate(
    input: AddressInput & { bedrooms?: number; bathrooms?: number; sqft?: number; zipcode?: string },
  ): Promise<RentalEstimate | null> {
    // Try ATTOM rental AVM endpoint first
    if (input.address || input.attom_id) {
      const params = this.buildAddressParams(input);
      const data = await this.request<Record<string, unknown>>(
        "/propertyapi/v1.0.0/avm/detail",
        params,
      );

      if (data) {
        try {
          const properties = (data as Record<string, unknown>).property as Record<string, unknown>[] | undefined;
          const prop = properties?.[0] as Record<string, unknown> | undefined;
          const avm = prop?.avm as Record<string, unknown> | undefined;
          const avmAmount = avm?.amount as Record<string, unknown> | undefined;
          const rentalAvm = prop?.rentalAvm as Record<string, unknown> | undefined;
          const rentalAmount = rentalAvm?.amount as Record<string, unknown> | undefined;

          if (rentalAmount) {
            const estimatedValue = (avmAmount?.value as number) ?? null;
            const rentMonthly = (rentalAmount?.value as number) ?? null;

            return {
              estimated_rent_monthly: rentMonthly,
              rent_low: (rentalAmount?.low as number) ?? null,
              rent_high: (rentalAmount?.high as number) ?? null,
              cap_rate_estimate: estimatedValue && rentMonthly
                ? Math.round(((rentMonthly * 12) / estimatedValue) * 10000) / 10000
                : null,
              gross_yield: estimatedValue && rentMonthly
                ? Math.round(((rentMonthly * 12) / estimatedValue) * 10000) / 10000
                : null,
              nearby_avg_rent: null,
            };
          }

          // Fallback: estimate from property value using 1% rule
          const estimatedValue = (avmAmount?.value as number) ?? null;
          if (estimatedValue) {
            return this.estimateRentFromValue(estimatedValue);
          }
        } catch (err) {
          log("warn", `Error parsing rental data, falling back: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }

    // If no ATTOM data, try to get valuation and estimate
    if (input.address || input.attom_id) {
      const valuation = await this.getValuation(input);
      if (valuation?.estimated_value) {
        return this.estimateRentFromValue(valuation.estimated_value);
      }
    }

    return null;
  }

  /** Fallback rental estimate using the 1% rule (and variations) */
  private estimateRentFromValue(propertyValue: number): RentalEstimate {
    // 1% rule as baseline, with low/high range
    const baseRent = Math.round(propertyValue * 0.008); // 0.8% — slightly conservative
    const rentLow = Math.round(propertyValue * 0.006);
    const rentHigh = Math.round(propertyValue * 0.012);

    return {
      estimated_rent_monthly: baseRent,
      rent_low: rentLow,
      rent_high: rentHigh,
      cap_rate_estimate: Math.round(((baseRent * 12) / propertyValue) * 10000) / 10000,
      gross_yield: Math.round(((baseRent * 12) / propertyValue) * 10000) / 10000,
      nearby_avg_rent: null,
    };
  }

  /** Search for foreclosure properties */
  async searchForeclosures(criteria: {
    zipcode?: string;
    city?: string;
    state?: string;
    limit?: number;
  }): Promise<ForeclosureResult[]> {
    const params = new URLSearchParams();

    if (criteria.zipcode) params.set("postalcode", criteria.zipcode);
    if (criteria.city) params.set("cityName", criteria.city);
    if (criteria.state) params.set("stateCode", criteria.state);

    const limit = criteria.limit ?? 20;
    params.set("pageSize", String(limit));

    // Try pre-foreclosure endpoint
    const data = await this.request<Record<string, unknown>>(
      "/propertyapi/v1.0.0/property/preforeclosure",
      params,
    );

    if (!data) return [];

    try {
      const properties = (data as Record<string, unknown>).property as Record<string, unknown>[] | undefined;
      if (!properties || !Array.isArray(properties)) return [];

      return properties.map((prop) => {
        const address = prop.address as Record<string, unknown> | undefined;
        const foreclosure = prop.foreclosure as Record<string, unknown> | undefined;
        const avm = prop.avm as Record<string, unknown> | undefined;
        const avmAmount = avm?.amount as Record<string, unknown> | undefined;

        // Determine foreclosure status
        let status: "pre-foreclosure" | "auction" | "reo" | null = null;
        const fcType = (foreclosure?.foreclosureType as string)?.toLowerCase() ?? "";
        if (fcType.includes("reo") || fcType.includes("bank")) {
          status = "reo";
        } else if (fcType.includes("auction")) {
          status = "auction";
        } else {
          status = "pre-foreclosure";
        }

        return {
          address: (address?.oneLine as string) ?? "Unknown",
          status,
          estimated_value: (avmAmount?.value as number) ?? null,
          outstanding_balance: (foreclosure?.loanBalance as number)
            ?? (foreclosure?.originalLoanAmount as number)
            ?? null,
          default_date: (foreclosure?.defaultDate as string)
            ?? (foreclosure?.recordingDate as string)
            ?? null,
        };
      }).slice(0, limit);
    } catch (err) {
      log("error", `Error parsing foreclosures: ${err instanceof Error ? err.message : String(err)}`);
      return [];
    }
  }

  /** Check if the client is configured (has an API key) */
  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }
}
