#!/usr/bin/env node
/**
 * mcp-property-intelligence — Property intelligence MCP server.
 *
 * Provides comprehensive real estate data via 8 tools:
 *   1. get_property_details  — bedrooms, sqft, year built, etc.
 *   2. get_valuation          — AVM estimates, price history
 *   3. get_owner_info         — owner name, type, purchase history
 *   4. get_comparable_sales   — recent nearby sales
 *   5. search_properties      — find properties by criteria
 *   6. get_rental_estimate    — monthly rent estimate + yields
 *   7. analyze_investment     — full investment analysis (mortgage, cap rate, ROI)
 *   8. search_foreclosures    — pre-foreclosure, auction, REO properties
 *
 * Data sources: ATTOM Data (primary), Zillow (backup/enrichment).
 * Auth: ATTOM_API_KEY env var (required). ZILLOW_API_KEY optional.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { AttomClient } from "./attom-client.js";
import { ZillowClient } from "./zillow-client.js";
import { analyzeInvestment } from "./investment-calculator.js";
// ---------------------------------------------------------------------------
// Logging (stderr to keep MCP stdio transport clean)
// ---------------------------------------------------------------------------
function log(level, message, meta) {
    const entry = { ts: new Date().toISOString(), level, message, ...meta };
    process.stderr.write(JSON.stringify(entry) + "\n");
}
// ---------------------------------------------------------------------------
// Initialize clients
// ---------------------------------------------------------------------------
const ATTOM_API_KEY = process.env.ATTOM_API_KEY ?? "";
const ZILLOW_API_KEY = process.env.ZILLOW_API_KEY ?? "";
const attom = new AttomClient(ATTOM_API_KEY);
const zillow = new ZillowClient(ZILLOW_API_KEY);
if (!ATTOM_API_KEY) {
    log("warn", "ATTOM_API_KEY not set — property tools will use Zillow fallback only");
}
if (!ZILLOW_API_KEY) {
    log("info", "ZILLOW_API_KEY not set — Zillow enrichment disabled");
}
// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------
const server = new McpServer({
    name: "mcp-property-intelligence",
    version: "1.0.0",
});
// ---------------------------------------------------------------------------
// Tool 1: get_property_details
// ---------------------------------------------------------------------------
server.tool("get_property_details", "Get comprehensive property details — bedrooms, bathrooms, sqft, lot size, year built, construction, heating/cooling, garage, pool, and more.", {
    address: z.string().optional().describe("Street address (e.g. '123 Main St')"),
    city: z.string().optional().describe("City name"),
    state: z.string().optional().describe("State code (e.g. 'CA')"),
    zip: z.string().optional().describe("ZIP code"),
    attom_id: z.number().optional().describe("ATTOM property ID (if known)"),
}, async (params) => {
    if (!params.address && !params.attom_id) {
        return { content: [{ type: "text", text: "Error: Provide either an address or attom_id." }] };
    }
    let result = null;
    // Try ATTOM first
    if (attom.isConfigured()) {
        result = await attom.getPropertyDetails({
            address: params.address,
            city: params.city,
            state: params.state,
            zip: params.zip,
            attom_id: params.attom_id,
        });
    }
    // Fallback to Zillow
    if (!result && zillow.isConfigured() && params.address) {
        const fullAddress = buildFullAddress(params.address, params.city, params.state, params.zip);
        result = await zillow.getPropertyDetails(fullAddress);
    }
    if (!result) {
        return { content: [{ type: "text", text: "No property details found. Check the address and try again." }] };
    }
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});
// ---------------------------------------------------------------------------
// Tool 2: get_valuation
// ---------------------------------------------------------------------------
server.tool("get_valuation", "Get property valuation — estimated market value (AVM), confidence score, price per sqft, last sale info, and value change trends.", {
    address: z.string().optional().describe("Street address"),
    city: z.string().optional().describe("City name"),
    state: z.string().optional().describe("State code"),
    zip: z.string().optional().describe("ZIP code"),
    attom_id: z.number().optional().describe("ATTOM property ID"),
}, async (params) => {
    if (!params.address && !params.attom_id) {
        return { content: [{ type: "text", text: "Error: Provide either an address or attom_id." }] };
    }
    let result = null;
    if (attom.isConfigured()) {
        result = await attom.getValuation({
            address: params.address,
            city: params.city,
            state: params.state,
            zip: params.zip,
            attom_id: params.attom_id,
        });
    }
    if (!result && zillow.isConfigured() && params.address) {
        const fullAddress = buildFullAddress(params.address, params.city, params.state, params.zip);
        result = await zillow.getValuation(fullAddress);
    }
    if (!result) {
        return { content: [{ type: "text", text: "No valuation data found. Check the address and try again." }] };
    }
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});
// ---------------------------------------------------------------------------
// Tool 3: get_owner_info
// ---------------------------------------------------------------------------
server.tool("get_owner_info", "Get property owner information — owner name, type (individual/corporate/trust), mailing address, owner-occupied status, purchase history.", {
    address: z.string().optional().describe("Street address"),
    city: z.string().optional().describe("City name"),
    state: z.string().optional().describe("State code"),
    zip: z.string().optional().describe("ZIP code"),
    attom_id: z.number().optional().describe("ATTOM property ID"),
}, async (params) => {
    if (!params.address && !params.attom_id) {
        return { content: [{ type: "text", text: "Error: Provide either an address or attom_id." }] };
    }
    if (!attom.isConfigured()) {
        return { content: [{ type: "text", text: "Owner info requires ATTOM API. Set ATTOM_API_KEY." }] };
    }
    const result = await attom.getOwnerInfo({
        address: params.address,
        city: params.city,
        state: params.state,
        zip: params.zip,
        attom_id: params.attom_id,
    });
    if (!result) {
        return { content: [{ type: "text", text: "No owner info found. Check the address and try again." }] };
    }
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});
// ---------------------------------------------------------------------------
// Tool 4: get_comparable_sales
// ---------------------------------------------------------------------------
server.tool("get_comparable_sales", "Find comparable property sales near a given address — sale price, date, sqft, price per sqft, distance, and similarity score.", {
    address: z.string().describe("Street address of the subject property"),
    city: z.string().optional().describe("City name"),
    state: z.string().optional().describe("State code"),
    zip: z.string().optional().describe("ZIP code"),
    radius_miles: z.number().optional().describe("Search radius in miles (default: 1)"),
    months_back: z.number().optional().describe("How many months back to search (default: 6)"),
    limit: z.number().optional().describe("Max number of comps to return (default: 10)"),
}, async (params) => {
    if (!attom.isConfigured()) {
        return { content: [{ type: "text", text: "Comparable sales require ATTOM API. Set ATTOM_API_KEY." }] };
    }
    const results = await attom.getComparableSales({
        address: params.address,
        city: params.city,
        state: params.state,
        zip: params.zip,
    }, params.radius_miles ?? 1, params.months_back ?? 6, params.limit ?? 10);
    if (results.length === 0) {
        return { content: [{ type: "text", text: "No comparable sales found. Try expanding radius or months_back." }] };
    }
    return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
});
// ---------------------------------------------------------------------------
// Tool 5: search_properties
// ---------------------------------------------------------------------------
server.tool("search_properties", "Search for properties by location and criteria — filter by price range, property type, bedrooms, sqft. Returns property summaries with valuations.", {
    zipcode: z.string().optional().describe("ZIP code to search"),
    city: z.string().optional().describe("City name"),
    state: z.string().optional().describe("State code (e.g. 'GA')"),
    min_price: z.number().optional().describe("Minimum property value"),
    max_price: z.number().optional().describe("Maximum property value"),
    property_type: z.string().optional().describe("Property type (e.g. 'SFR', 'CONDO', 'MULTI-FAMILY')"),
    min_beds: z.number().optional().describe("Minimum bedrooms"),
    min_sqft: z.number().optional().describe("Minimum square footage"),
    limit: z.number().optional().describe("Max results to return (default: 20)"),
}, async (params) => {
    if (!params.zipcode && !params.city && !params.state) {
        return { content: [{ type: "text", text: "Error: Provide at least a zipcode, city, or state." }] };
    }
    if (!attom.isConfigured()) {
        return { content: [{ type: "text", text: "Property search requires ATTOM API. Set ATTOM_API_KEY." }] };
    }
    const results = await attom.searchProperties({
        zipcode: params.zipcode,
        city: params.city,
        state: params.state,
        min_price: params.min_price,
        max_price: params.max_price,
        property_type: params.property_type,
        min_beds: params.min_beds,
        min_sqft: params.min_sqft,
        limit: params.limit,
    });
    if (results.length === 0) {
        return { content: [{ type: "text", text: "No properties found. Try broadening your search criteria." }] };
    }
    return {
        content: [{
                type: "text",
                text: `Found ${results.length} properties:\n\n${JSON.stringify(results, null, 2)}`,
            }],
    };
});
// ---------------------------------------------------------------------------
// Tool 6: get_rental_estimate
// ---------------------------------------------------------------------------
server.tool("get_rental_estimate", "Estimate monthly rental income for a property — estimated rent, range, cap rate, and gross yield. Works with address or property characteristics.", {
    address: z.string().optional().describe("Street address"),
    city: z.string().optional().describe("City name"),
    state: z.string().optional().describe("State code"),
    zip: z.string().optional().describe("ZIP code"),
    attom_id: z.number().optional().describe("ATTOM property ID"),
    bedrooms: z.number().optional().describe("Number of bedrooms (for estimate without address)"),
    bathrooms: z.number().optional().describe("Number of bathrooms"),
    sqft: z.number().optional().describe("Square footage"),
    zipcode: z.string().optional().describe("ZIP code (for estimate without address)"),
}, async (params) => {
    let result = null;
    // Try ATTOM first
    if (attom.isConfigured() && (params.address || params.attom_id)) {
        result = await attom.getRentalEstimate({
            address: params.address,
            city: params.city,
            state: params.state,
            zip: params.zip ?? params.zipcode,
            attom_id: params.attom_id,
            bedrooms: params.bedrooms,
            bathrooms: params.bathrooms,
            sqft: params.sqft,
            zipcode: params.zipcode ?? params.zip,
        });
    }
    // Try Zillow
    if (!result && zillow.isConfigured() && params.address) {
        const fullAddress = buildFullAddress(params.address, params.city, params.state, params.zip ?? params.zipcode);
        result = await zillow.getRentalEstimate(fullAddress);
    }
    if (!result) {
        return { content: [{ type: "text", text: "Could not estimate rental income. Provide an address or property characteristics." }] };
    }
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});
// ---------------------------------------------------------------------------
// Tool 7: analyze_investment
// ---------------------------------------------------------------------------
server.tool("analyze_investment", "Full investment analysis for a property — combines property value, rental estimate, and financing to calculate mortgage, cash flow, cap rate, cash-on-cash return, and break-even rent.", {
    address: z.string().describe("Street address of the property"),
    city: z.string().optional().describe("City name"),
    state: z.string().optional().describe("State code"),
    zip: z.string().optional().describe("ZIP code"),
    purchase_price: z.number().optional().describe("Planned purchase price (defaults to estimated value)"),
    down_payment_pct: z.number().optional().describe("Down payment percentage as decimal (default: 0.20 = 20%)"),
    interest_rate: z.number().optional().describe("Annual interest rate as decimal (default: 0.07 = 7%)"),
    loan_term_years: z.number().optional().describe("Loan term in years (default: 30)"),
}, async (params) => {
    const addressInput = {
        address: params.address,
        city: params.city,
        state: params.state,
        zip: params.zip,
    };
    // Step 1: Get property valuation
    let propertyValue = null;
    if (attom.isConfigured()) {
        const valuation = await attom.getValuation(addressInput);
        propertyValue = valuation?.estimated_value ?? null;
    }
    if (!propertyValue && zillow.isConfigured()) {
        const fullAddress = buildFullAddress(params.address, params.city, params.state, params.zip);
        const valuation = await zillow.getValuation(fullAddress);
        propertyValue = valuation?.estimated_value ?? null;
    }
    if (!propertyValue) {
        return { content: [{ type: "text", text: "Could not determine property value. Cannot perform investment analysis without a valuation." }] };
    }
    // Step 2: Get rental estimate
    let estimatedRent = null;
    if (attom.isConfigured()) {
        const rental = await attom.getRentalEstimate(addressInput);
        estimatedRent = rental?.estimated_rent_monthly ?? null;
    }
    if (!estimatedRent && zillow.isConfigured()) {
        const fullAddress = buildFullAddress(params.address, params.city, params.state, params.zip);
        const rental = await zillow.getRentalEstimate(fullAddress);
        estimatedRent = rental?.estimated_rent_monthly ?? null;
    }
    // Last resort: 0.8% rule
    if (!estimatedRent) {
        estimatedRent = Math.round(propertyValue * 0.008);
    }
    // Step 3: Run investment analysis
    const analysis = analyzeInvestment({
        propertyValue,
        purchasePrice: params.purchase_price,
        downPaymentPct: params.down_payment_pct,
        interestRate: params.interest_rate,
        loanTermYears: params.loan_term_years,
        estimatedMonthlyRent: estimatedRent,
    });
    return { content: [{ type: "text", text: JSON.stringify(analysis, null, 2) }] };
});
// ---------------------------------------------------------------------------
// Tool 8: search_foreclosures
// ---------------------------------------------------------------------------
server.tool("search_foreclosures", "Search for foreclosure and pre-foreclosure properties — find distressed properties including pre-foreclosure, auction, and REO (bank-owned).", {
    zipcode: z.string().optional().describe("ZIP code to search"),
    city: z.string().optional().describe("City name"),
    state: z.string().optional().describe("State code"),
    limit: z.number().optional().describe("Max results (default: 20)"),
}, async (params) => {
    if (!params.zipcode && !params.city && !params.state) {
        return { content: [{ type: "text", text: "Error: Provide at least a zipcode, city, or state." }] };
    }
    if (!attom.isConfigured()) {
        return { content: [{ type: "text", text: "Foreclosure search requires ATTOM API. Set ATTOM_API_KEY." }] };
    }
    const results = await attom.searchForeclosures({
        zipcode: params.zipcode,
        city: params.city,
        state: params.state,
        limit: params.limit,
    });
    if (results.length === 0) {
        return { content: [{ type: "text", text: "No foreclosure properties found in this area." }] };
    }
    return {
        content: [{
                type: "text",
                text: `Found ${results.length} foreclosure properties:\n\n${JSON.stringify(results, null, 2)}`,
            }],
    };
});
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/** Build a full address string from parts */
function buildFullAddress(address, city, state, zip) {
    const parts = [address];
    if (city)
        parts.push(city);
    if (state)
        parts.push(state);
    if (zip)
        parts.push(zip);
    return parts.filter(Boolean).join(", ");
}
// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    log("info", "mcp-property-intelligence server started", {
        attom_configured: attom.isConfigured(),
        zillow_configured: zillow.isConfigured(),
    });
}
main().catch((err) => {
    log("error", `Fatal error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
});
//# sourceMappingURL=index.js.map