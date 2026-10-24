/**
 * Centralized Pricing and Fee Calculation Engine for SkillConnect.
 * Single source of truth for all fee rules, tax calculations, and estimate boundaries.
 */

export const DEFAULT_TAX_RATE = 0.0875; // 8.75% CA state + local sales tax

export interface FeeCalculationInput {
  diagnosticFee: number;
  hourlyRate: number;
  estimatedHoursMin?: number;
  estimatedHoursMax?: number;
  partsMin?: number;
  partsMax?: number;
  taxRate?: number;
}

export interface FeeCalculationResult {
  diagnosticFee: number;
  diagnosticCredit: number; // 100% credited toward completed labor
  laborMin: number;
  laborMax: number;
  partsMin: number;
  partsMax: number;
  subtotalMin: number;
  subtotalMax: number;
  taxAmount: number;
  totalMin: number;
  totalMax: number;
  escrowAuthorizedHold: number;
}

/**
 * Calculates a verified, deterministic fee breakdown with consistent rounding.
 */
export function calculateFees(input: FeeCalculationInput): FeeCalculationResult {
  const diagnosticFee = Math.max(0, Math.round(input.diagnosticFee)) || 0;
  const hourlyRate = Math.max(0, Math.round(input.hourlyRate)) || 0;
  const hoursMin = Math.max(0, input.estimatedHoursMin ?? 1.0);
  const hoursMax = Math.max(hoursMin, input.estimatedHoursMax ?? Math.max(hoursMin, 2.0));
  const partsMin = Math.max(0, Math.round(input.partsMin ?? 0)) || 0;
  const partsMax = Math.max(partsMin, Math.round(input.partsMax ?? 0)) || 0;
  const taxRate = Math.max(0, input.taxRate ?? DEFAULT_TAX_RATE);

  const laborMin = Math.round(hoursMin * hourlyRate) || 0;
  const laborMax = Math.round(hoursMax * hourlyRate) || 0;

  // Diagnostic fee is credited toward repair labor
  const diagnosticCredit = diagnosticFee;

  const subtotalMin = Math.max(diagnosticFee, laborMin + partsMin);
  const subtotalMax = Math.max(subtotalMin, laborMax + partsMax);

  const taxAmount = Math.round(diagnosticFee * taxRate * 100) / 100;

  return {
    diagnosticFee,
    diagnosticCredit,
    laborMin,
    laborMax,
    partsMin,
    partsMax,
    subtotalMin,
    subtotalMax,
    taxAmount,
    totalMin: subtotalMin,
    totalMax: subtotalMax,
    escrowAuthorizedHold: diagnosticFee,
  };
}
