/**
 * Investment analysis calculations — mortgage, cap rate, cash flow, ROI.
 *
 * Pure math, no API calls. Used by the analyze_investment tool to
 * produce a full investment breakdown from property + rental data.
 */
import type { InvestmentAnalysis } from "./types.js";
export declare function calculateMonthlyMortgage(principal: number, annualRate: number, termYears: number): number;
export interface InvestmentInput {
    propertyValue: number;
    purchasePrice?: number;
    downPaymentPct?: number;
    interestRate?: number;
    loanTermYears?: number;
    estimatedMonthlyRent: number;
}
export declare function analyzeInvestment(input: InvestmentInput): InvestmentAnalysis;
//# sourceMappingURL=investment-calculator.d.ts.map