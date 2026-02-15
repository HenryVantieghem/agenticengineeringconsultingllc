/**
 * ATTOM Data API client — property details, valuations, owner info,
 * comparable sales, property search, and foreclosure data.
 *
 * Auth: `apikey` header.
 * Rate limit: 1 req/sec enforced via internal throttle.
 * Session-level cache (in-memory Map) to avoid redundant lookups.
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
const BASE_URL = "https://api.gateway.attomdata.com";
export class AttomClient {
    apiKey;
    lastRequestTime = 0;
    cache = new Map();
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    // -------------------------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------------------------
    /** Enforce 1 req/sec rate limit */
    async throttle() {
        const now = Date.now();
        const elapsed = now - this.lastRequestTime;
        if (elapsed < 1000) {
            await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
        }
        this.lastRequestTime = Date.now();
    }
    /** Build query string from address input */
    buildAddressParams(input) {
        const params = new URLSearchParams();
        if (input.attom_id) {
            params.set("attomid", String(input.attom_id));
        }
        else {
            if (input.address) {
                // ATTOM expects address1 (street) and address2 (city, state zip)
                params.set("address1", input.address);
                if (input.city && input.state) {
                    const address2Parts = [input.city, input.state];
                    if (input.zip)
                        address2Parts.push(input.zip);
                    params.set("address2", address2Parts.join(", "));
                }
                else if (input.zip) {
                    params.set("address2", input.zip);
                }
            }
        }
        return params;
    }
    /** Make an authenticated GET request to ATTOM API */
    async request(path, params) {
        const cacheKey = `${path}?${params.toString()}`;
        if (this.cache.has(cacheKey)) {
            log("info", `Cache hit: ${cacheKey}`);
            return this.cache.get(cacheKey);
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
                return this.request(path, params);
            }
            if (!res.ok) {
                const body = await res.text();
                log("error", `ATTOM API error: ${res.status}`, { body });
                return null;
            }
            const data = (await res.json());
            this.cache.set(cacheKey, data);
            return data;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            log("error", `ATTOM fetch error: ${message}`);
            return null;
        }
    }
    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------
    /** Get detailed property information */
    async getPropertyDetails(input) {
        const params = this.buildAddressParams(input);
        const data = await this.request("/propertyapi/v1.0.0/property/detail", params);
        if (!data)
            return null;
        try {
            // ATTOM nests property data under property[0]
            const properties = data.property;
            const prop = properties?.[0];
            if (!prop)
                return null;
            const address = prop.address;
            const building = prop.building;
            const lot = prop.lot;
            const summary = prop.summary;
            const utilities = prop.utilities;
            const buildingSize = building?.size;
            const rooms = building?.rooms;
            const construction = building?.construction;
            const parking = building?.parking;
            const lotSize = lot?.lotSize;
            const fullAddress = [
                address?.oneLine ?? address?.line1,
            ].filter(Boolean).join(", ");
            return {
                address: fullAddress || input.address || "Unknown",
                attom_id: prop.identifier?.attomId ?? null,
                bedrooms: rooms?.bedrooms ?? null,
                bathrooms: rooms?.bathsFull ?? null,
                sqft: buildingSize?.livingSize ?? buildingSize?.universalSize ?? null,
                lot_size_sqft: lotSize?.lotSize1 ?? null,
                year_built: summary?.yearBuilt ?? null,
                property_type: summary?.propType ?? summary?.propSubType ?? null,
                stories: building?.summary?.stories ?? construction?.stories ?? null,
                garage: parking?.garage != null ? Boolean(parking.garage) : null,
                pool: summary?.pool ?? null,
                construction_type: construction?.constructionType ?? null,
                heating: utilities?.heatingType ?? null,
                cooling: utilities?.coolingType ?? null,
                roof_type: construction?.roofType ?? null,
                legal_description: lot?.legalDescription ?? summary?.legal1 ?? null,
            };
        }
        catch (err) {
            log("error", `Error parsing property details: ${err instanceof Error ? err.message : String(err)}`);
            return null;
        }
    }
    /** Get automated valuation model (AVM) data */
    async getValuation(input) {
        const params = this.buildAddressParams(input);
        const data = await this.request("/propertyapi/v1.0.0/avm/detail", params);
        if (!data)
            return null;
        try {
            const properties = data.property;
            const prop = properties?.[0];
            if (!prop)
                return null;
            const address = prop.address;
            const avm = prop.avm;
            const avmAmount = avm?.amount;
            const sale = prop.sale;
            const saleAmount = sale?.amount;
            const building = prop.building;
            const buildingSize = building?.size;
            const estimatedValue = avmAmount?.value ?? null;
            const sqft = buildingSize?.livingSize ?? null;
            return {
                address: address?.oneLine ?? input.address ?? "Unknown",
                estimated_value: estimatedValue,
                value_low: avmAmount?.low ?? null,
                value_high: avmAmount?.high ?? null,
                confidence_score: avm?.confidence ?? avm?.confidenceScore ?? null,
                last_sale_price: saleAmount?.saleAmt ?? null,
                last_sale_date: sale?.saleTransDate ?? null,
                price_per_sqft: estimatedValue && sqft ? Math.round(estimatedValue / sqft) : null,
                value_change_1yr: avm?.changePercent1yr ?? null,
                value_change_5yr: avm?.changePercent5yr ?? null,
            };
        }
        catch (err) {
            log("error", `Error parsing valuation: ${err instanceof Error ? err.message : String(err)}`);
            return null;
        }
    }
    /** Get property owner information */
    async getOwnerInfo(input) {
        // Owner data comes from the property detail endpoint
        const params = this.buildAddressParams(input);
        const data = await this.request("/propertyapi/v1.0.0/property/detail", params);
        if (!data)
            return null;
        try {
            const properties = data.property;
            const prop = properties?.[0];
            if (!prop)
                return null;
            const assessment = prop.assessment;
            const owner = assessment?.owner;
            const sale = prop.sale;
            const saleAmount = sale?.amount;
            const mailingAddress = owner?.mailingAddress ?? prop.address;
            const summary = prop.summary;
            // Determine owner type from name patterns
            const ownerName = owner?.owner1?.fullName
                ?? owner?.absenteeOwnerStatus
                ?? null;
            let ownerType = null;
            if (ownerName) {
                const upper = ownerName.toUpperCase();
                if (upper.includes("LLC") || upper.includes("INC") || upper.includes("CORP") || upper.includes("CO")) {
                    ownerType = "corporate";
                }
                else if (upper.includes("TRUST") || upper.includes("ESTATE")) {
                    ownerType = "trust";
                }
                else {
                    ownerType = "individual";
                }
            }
            // Calculate ownership length
            const purchaseDateStr = sale?.saleTransDate ?? null;
            let ownershipYears = null;
            if (purchaseDateStr) {
                const purchaseDate = new Date(purchaseDateStr);
                const now = new Date();
                ownershipYears = Math.round(((now.getTime() - purchaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) * 10) / 10;
            }
            return {
                owner_name: ownerName,
                owner_type: ownerType,
                mailing_address: mailingAddress?.oneLine ?? null,
                owner_occupied: summary?.absenteeInd === "O" || owner?.absenteeOwnerStatus === "O",
                ownership_length_years: ownershipYears,
                purchase_price: saleAmount?.saleAmt ?? null,
                purchase_date: purchaseDateStr,
            };
        }
        catch (err) {
            log("error", `Error parsing owner info: ${err instanceof Error ? err.message : String(err)}`);
            return null;
        }
    }
    /** Get comparable sales near a property */
    async getComparableSales(input, radiusMiles = 1, monthsBack = 6, limit = 10) {
        const params = this.buildAddressParams(input);
        params.set("searchType", "proximity");
        params.set("radius", String(radiusMiles));
        params.set("monthsBack", String(monthsBack));
        params.set("limit", String(limit));
        const data = await this.request("/propertyapi/v1.0.0/salescomparables/detail", params);
        if (!data)
            return [];
        try {
            const properties = data.property;
            if (!properties || !Array.isArray(properties))
                return [];
            return properties.map((prop) => {
                const address = prop.address;
                const sale = prop.sale;
                const saleAmount = sale?.amount;
                const building = prop.building;
                const buildingSize = building?.size;
                const rooms = building?.rooms;
                const proximity = prop.proximity;
                const salePrice = saleAmount?.saleAmt ?? null;
                const sqft = buildingSize?.livingSize ?? null;
                return {
                    address: address?.oneLine ?? "Unknown",
                    sale_price: salePrice,
                    sale_date: sale?.saleTransDate ?? null,
                    sqft,
                    price_per_sqft: salePrice && sqft ? Math.round(salePrice / sqft) : null,
                    bedrooms: rooms?.bedrooms ?? null,
                    bathrooms: rooms?.bathsFull ?? null,
                    distance_miles: proximity?.distance ?? null,
                    similarity_score: proximity?.similarityScore ?? null,
                };
            }).slice(0, limit);
        }
        catch (err) {
            log("error", `Error parsing comparable sales: ${err instanceof Error ? err.message : String(err)}`);
            return [];
        }
    }
    /** Search properties by location and criteria */
    async searchProperties(criteria) {
        const params = new URLSearchParams();
        if (criteria.zipcode)
            params.set("postalcode", criteria.zipcode);
        if (criteria.city)
            params.set("cityName", criteria.city);
        if (criteria.state)
            params.set("stateCode", criteria.state);
        if (criteria.min_price)
            params.set("minAVMValue", String(criteria.min_price));
        if (criteria.max_price)
            params.set("maxAVMValue", String(criteria.max_price));
        if (criteria.property_type)
            params.set("propertyType", criteria.property_type);
        if (criteria.min_beds)
            params.set("minBeds", String(criteria.min_beds));
        if (criteria.min_sqft)
            params.set("minLivingSize", String(criteria.min_sqft));
        const limit = criteria.limit ?? 20;
        params.set("pageSize", String(limit));
        const data = await this.request("/propertyapi/v1.0.0/property/snapshot", params);
        if (!data)
            return [];
        try {
            const properties = data.property;
            if (!properties || !Array.isArray(properties))
                return [];
            return properties.map((prop) => {
                const address = prop.address;
                const building = prop.building;
                const buildingSize = building?.size;
                const rooms = building?.rooms;
                const summary = prop.summary;
                const avm = prop.avm;
                const avmAmount = avm?.amount;
                const sale = prop.sale;
                const saleAmount = sale?.amount;
                const identifier = prop.identifier;
                return {
                    address: address?.oneLine ?? "Unknown",
                    attom_id: identifier?.attomId ?? null,
                    bedrooms: rooms?.bedrooms ?? null,
                    bathrooms: rooms?.bathsFull ?? null,
                    sqft: buildingSize?.livingSize ?? null,
                    year_built: summary?.yearBuilt ?? null,
                    property_type: summary?.propType ?? null,
                    estimated_value: avmAmount?.value ?? null,
                    last_sale_price: saleAmount?.saleAmt ?? null,
                    last_sale_date: sale?.saleTransDate ?? null,
                };
            }).slice(0, limit);
        }
        catch (err) {
            log("error", `Error parsing property search: ${err instanceof Error ? err.message : String(err)}`);
            return [];
        }
    }
    /** Get rental estimate for a property */
    async getRentalEstimate(input) {
        // Try ATTOM rental AVM endpoint first
        if (input.address || input.attom_id) {
            const params = this.buildAddressParams(input);
            const data = await this.request("/propertyapi/v1.0.0/avm/detail", params);
            if (data) {
                try {
                    const properties = data.property;
                    const prop = properties?.[0];
                    const avm = prop?.avm;
                    const avmAmount = avm?.amount;
                    const rentalAvm = prop?.rentalAvm;
                    const rentalAmount = rentalAvm?.amount;
                    if (rentalAmount) {
                        const estimatedValue = avmAmount?.value ?? null;
                        const rentMonthly = rentalAmount?.value ?? null;
                        return {
                            estimated_rent_monthly: rentMonthly,
                            rent_low: rentalAmount?.low ?? null,
                            rent_high: rentalAmount?.high ?? null,
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
                    const estimatedValue = avmAmount?.value ?? null;
                    if (estimatedValue) {
                        return this.estimateRentFromValue(estimatedValue);
                    }
                }
                catch (err) {
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
    estimateRentFromValue(propertyValue) {
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
    async searchForeclosures(criteria) {
        const params = new URLSearchParams();
        if (criteria.zipcode)
            params.set("postalcode", criteria.zipcode);
        if (criteria.city)
            params.set("cityName", criteria.city);
        if (criteria.state)
            params.set("stateCode", criteria.state);
        const limit = criteria.limit ?? 20;
        params.set("pageSize", String(limit));
        // Try pre-foreclosure endpoint
        const data = await this.request("/propertyapi/v1.0.0/property/preforeclosure", params);
        if (!data)
            return [];
        try {
            const properties = data.property;
            if (!properties || !Array.isArray(properties))
                return [];
            return properties.map((prop) => {
                const address = prop.address;
                const foreclosure = prop.foreclosure;
                const avm = prop.avm;
                const avmAmount = avm?.amount;
                // Determine foreclosure status
                let status = null;
                const fcType = foreclosure?.foreclosureType?.toLowerCase() ?? "";
                if (fcType.includes("reo") || fcType.includes("bank")) {
                    status = "reo";
                }
                else if (fcType.includes("auction")) {
                    status = "auction";
                }
                else {
                    status = "pre-foreclosure";
                }
                return {
                    address: address?.oneLine ?? "Unknown",
                    status,
                    estimated_value: avmAmount?.value ?? null,
                    outstanding_balance: foreclosure?.loanBalance
                        ?? foreclosure?.originalLoanAmount
                        ?? null,
                    default_date: foreclosure?.defaultDate
                        ?? foreclosure?.recordingDate
                        ?? null,
                };
            }).slice(0, limit);
        }
        catch (err) {
            log("error", `Error parsing foreclosures: ${err instanceof Error ? err.message : String(err)}`);
            return [];
        }
    }
    /** Check if the client is configured (has an API key) */
    isConfigured() {
        return this.apiKey.length > 0;
    }
}
//# sourceMappingURL=attom-client.js.map