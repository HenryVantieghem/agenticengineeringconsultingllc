/**
 * Zillow API client — backup/enrichment data source.
 *
 * Provides Zestimate data and property search as a fallback
 * when ATTOM data is unavailable or for cross-referencing.
 *
 * Uses the Zillow/Bridge API (RapidAPI-style) or direct endpoints.
 */
// ---------------------------------------------------------------------------
// Logging (stderr to keep MCP stdio clean)
// ---------------------------------------------------------------------------
function log(level, message, meta) {
    const entry = { ts: new Date().toISOString(), level, message, ...meta };
    process.stderr.write(JSON.stringify(entry) + "\n");
}
// ---------------------------------------------------------------------------
// Client class
// ---------------------------------------------------------------------------
const ZILLOW_BASE_URL = "https://zillow-com1.p.rapidapi.com";
export class ZillowClient {
    apiKey;
    cache = new Map();
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    // -------------------------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------------------------
    async request(path, params) {
        const cacheKey = `zillow:${path}?${params.toString()}`;
        if (this.cache.has(cacheKey)) {
            log("info", `Zillow cache hit: ${cacheKey}`);
            return this.cache.get(cacheKey);
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
            const data = (await res.json());
            this.cache.set(cacheKey, data);
            return data;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            log("error", `Zillow fetch error: ${message}`);
            return null;
        }
    }
    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------
    /** Get property details from Zillow */
    async getPropertyDetails(address) {
        const params = new URLSearchParams({ address });
        const data = await this.request("/property", params);
        if (!data)
            return null;
        try {
            return {
                address: data.address ?? data.streetAddress ?? address,
                attom_id: null,
                bedrooms: data.bedrooms ?? null,
                bathrooms: data.bathrooms ?? null,
                sqft: data.livingArea ?? data.livingAreaValue ?? null,
                lot_size_sqft: data.lotAreaValue ?? data.lotSize ?? null,
                year_built: data.yearBuilt ?? null,
                property_type: data.homeType ?? data.propertyTypeDimension ?? null,
                stories: data.stories ?? null,
                garage: data.hasGarage != null ? Boolean(data.hasGarage) : null,
                pool: data.hasPool != null ? Boolean(data.hasPool) : null,
                construction_type: null,
                heating: data.heatingSystem ?? null,
                cooling: data.coolingSystem ?? null,
                roof_type: data.roofType ?? null,
                legal_description: null,
            };
        }
        catch (err) {
            log("error", `Error parsing Zillow property: ${err instanceof Error ? err.message : String(err)}`);
            return null;
        }
    }
    /** Get Zestimate valuation from Zillow */
    async getValuation(address) {
        const params = new URLSearchParams({ address });
        const data = await this.request("/property", params);
        if (!data)
            return null;
        try {
            const zestimate = data.zestimate ?? null;
            const rentZestimate = data.rentZestimate ?? null;
            const sqft = data.livingArea ?? null;
            return {
                address: data.address ?? address,
                estimated_value: zestimate,
                value_low: data.zestimateLowPercent
                    ? zestimate ? Math.round(zestimate * (1 - data.zestimateLowPercent / 100)) : null
                    : null,
                value_high: data.zestimateHighPercent
                    ? zestimate ? Math.round(zestimate * (1 + data.zestimateHighPercent / 100)) : null
                    : null,
                confidence_score: null,
                last_sale_price: data.lastSoldPrice ?? null,
                last_sale_date: data.datePostedString ?? null,
                price_per_sqft: zestimate && sqft ? Math.round(zestimate / sqft) : null,
                value_change_1yr: data.oneYearForecast ?? null,
                value_change_5yr: null,
            };
        }
        catch (err) {
            log("error", `Error parsing Zillow valuation: ${err instanceof Error ? err.message : String(err)}`);
            return null;
        }
    }
    /** Get rental estimate from Zillow rent Zestimate */
    async getRentalEstimate(address) {
        const params = new URLSearchParams({ address });
        const data = await this.request("/property", params);
        if (!data)
            return null;
        try {
            const rentZestimate = data.rentZestimate ?? null;
            const zestimate = data.zestimate ?? null;
            if (!rentZestimate)
                return null;
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
        }
        catch (err) {
            log("error", `Error parsing Zillow rental: ${err instanceof Error ? err.message : String(err)}`);
            return null;
        }
    }
    /** Check if the client is configured */
    isConfigured() {
        return this.apiKey.length > 0;
    }
}
//# sourceMappingURL=zillow-client.js.map