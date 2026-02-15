/**
 * Investment analysis calculations — mortgage, cap rate, cash flow, ROI.
 *
 * Pure math, no API calls. Used by the analyze_investment tool to
 * produce a full investment breakdown from property + rental data.
 */

import type { InvestmentAnalysis } from "./types.js";

// ---------------------------------------------------------------------------
// Constants (reasonable US defaults)
// ---------------------------------------------------------------------------

/** Annual property tax rate (national average ~1.1%) */
const DEFAULT_PROPERTY_TAX_RATE = 0.011;

/** Annual insurance rate as % of property value */
const DEFAULT_INSURANCE_RATE = 0.005;

/** Monthly maintenance as % of property value */
const DEFAULT_MAINTENANCE_RATE = 0.01 / 12; // ~1% annual

/** Vacancy rate assumption */
const DEFAULT_VACANCY_RATE = 0.08; // 8%

// ---------------------------------------------------------------------------
// Monthly mortgage (standard amortization formula)
// ---------------------------------------------------------------------------

export function calculateMonthlyMortgage(
  principal: number,
  annualRate: number,
  termYears: number,
): number {
  if (principal <= 0) return 0;
  if (annualRate <= 0) return principal / (termYears * 12);

  const monthlyRate = annualRate / 12;
  const numPayments = termYears * 12;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  return Math.round(payment * 100) / 100;
}

// ---------------------------------------------------------------------------
// Full investment analysis
// ---------------------------------------------------------------------------

export interface InvestmentInput {
  propertyValue: number;
  purchasePrice?: number;
  downPaymentPct?: number;
  interestRate?: number;
  loanTermYears?: number;
  estimatedMonthlyRent: number;
}

export function analyzeInvestment(input: InvestmentInput): InvestmentAnalysis {
  const {
    propertyValue,
    estimatedMonthlyRent,
  } = input;

  const purchasePrice = input.purchasePrice ?? propertyValue;
  const downPaymentPct = input.downPaymentPct ?? 0.20;
  const interestRate = input.interestRate ?? 0.07;
  const loanTermYears = input.loanTermYears ?? 30;

  // Loan breakdown
  const downPayment = Math.round(purchasePrice * downPaymentPct);
  const loanAmount = purchasePrice - downPayment;
  const monthlyMortgage = calculateMonthlyMortgage(loanAmount, interestRate, loanTermYears);

  // Operating expenses (monthly)
  const monthlyTax = (propertyValue * DEFAULT_PROPERTY_TAX_RATE) / 12;
  const monthlyInsurance = (propertyValue * DEFAULT_INSURANCE_RATE) / 12;
  const monthlyMaintenance = propertyValue * DEFAULT_MAINTENANCE_RATE;
  const monthlyVacancyReserve = estimatedMonthlyRent * DEFAULT_VACANCY_RATE;

  const totalMonthlyExpenses = Math.round(
    (monthlyMortgage + monthlyTax + monthlyInsurance + monthlyMaintenance + monthlyVacancyReserve) * 100,
  ) / 100;

  // Cash flow
  const monthlyCashFlow = Math.round((estimatedMonthlyRent - totalMonthlyExpenses) * 100) / 100;
  const annualCashFlow = Math.round(monthlyCashFlow * 12 * 100) / 100;

  // NOI (Net Operating Income) — excludes mortgage
  const annualGrossRent = estimatedMonthlyRent * 12;
  const annualOperatingExpenses =
    (monthlyTax + monthlyInsurance + monthlyMaintenance + monthlyVacancyReserve) * 12;
  const noi = annualGrossRent - annualOperatingExpenses;

  // Cap rate = NOI / Purchase Price
  const capRate = purchasePrice > 0
    ? Math.round((noi / purchasePrice) * 10000) / 10000
    : 0;

  // Cash-on-cash return = Annual Cash Flow / Total Cash Invested
  const cashOnCashReturn = downPayment > 0
    ? Math.round((annualCashFlow / downPayment) * 10000) / 10000
    : 0;

  // Break-even rent = total monthly expenses
  const breakEvenRent = totalMonthlyExpenses;

  return {
    property_value: propertyValue,
    purchase_price: purchasePrice,
    down_payment: downPayment,
    monthly_mortgage: monthlyMortgage,
    estimated_rent: estimatedMonthlyRent,
    monthly_cash_flow: monthlyCashFlow,
    annual_cash_flow: annualCashFlow,
    cap_rate: capRate,
    cash_on_cash_return: cashOnCashReturn,
    total_monthly_expenses: totalMonthlyExpenses,
    break_even_rent: breakEvenRent,
  };
}
