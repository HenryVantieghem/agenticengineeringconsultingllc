/**
 * Core types for the property intelligence MCP server.
 *
 * Shared interfaces for property data, valuations, owner info,
 * comparable sales, rental estimates, and investment analysis.
 */
export interface PropertyDetails {
    address: string;
    attom_id: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    sqft: number | null;
    lot_size_sqft: number | null;
    year_built: number | null;
    property_type: string | null;
    stories: number | null;
    garage: boolean | null;
    pool: boolean | null;
    construction_type: string | null;
    heating: string | null;
    cooling: string | null;
    roof_type: string | null;
    legal_description: string | null;
}
export interface ValuationResult {
    address: string;
    estimated_value: number | null;
    value_low: number | null;
    value_high: number | null;
    confidence_score: number | null;
    last_sale_price: number | null;
    last_sale_date: string | null;
    price_per_sqft: number | null;
    value_change_1yr: number | null;
    value_change_5yr: number | null;
}
export interface OwnerInfo {
    owner_name: string | null;
    owner_type: "individual" | "corporate" | "trust" | null;
    mailing_address: string | null;
    owner_occupied: boolean | null;
    ownership_length_years: number | null;
    purchase_price: number | null;
    purchase_date: string | null;
}
export interface ComparableSale {
    address: string;
    sale_price: number | null;
    sale_date: string | null;
    sqft: number | null;
    price_per_sqft: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    distance_miles: number | null;
    similarity_score: number | null;
}
export interface PropertySummary {
    address: string;
    attom_id: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    sqft: number | null;
    year_built: number | null;
    property_type: string | null;
    estimated_value: number | null;
    last_sale_price: number | null;
    last_sale_date: string | null;
}
export interface RentalEstimate {
    estimated_rent_monthly: number | null;
    rent_low: number | null;
    rent_high: number | null;
    cap_rate_estimate: number | null;
    gross_yield: number | null;
    nearby_avg_rent: number | null;
}
export interface InvestmentAnalysis {
    property_value: number;
    purchase_price: number;
    down_payment: number;
    monthly_mortgage: number;
    estimated_rent: number;
    monthly_cash_flow: number;
    annual_cash_flow: number;
    cap_rate: number;
    cash_on_cash_return: number;
    total_monthly_expenses: number;
    break_even_rent: number;
}
export interface ForeclosureResult {
    address: string;
    status: "pre-foreclosure" | "auction" | "reo" | null;
    estimated_value: number | null;
    outstanding_balance: number | null;
    default_date: string | null;
}
export interface AddressInput {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    attom_id?: number;
}
//# sourceMappingURL=types.d.ts.map