export * from './service';
export * from './professional';
export * from './booking';
export * from './auth';

export interface FilterState {
  query: string;
  location?: string;
  category: string;
  minRating: number | null; // e.g. 4.0, 4.5
  availableToday: boolean;
  priceTier: string; // 'all' | '$' | '$$' | '$$$'
  verifiedOnly?: boolean;
  sortBy: 'recommended' | 'rating' | 'price-asc';
}

export type EstimateStatus = 'success' | 'unsupported' | 'ambiguous' | 'invalid_input';

export interface AIEstimateResult {
  status: EstimateStatus;
  statusMessage?: string;
  categorySlug?: string;
  categoryName?: string;
  problemSummary?: string;
  complexity?: 'Low' | 'Moderate' | 'High' | 'Diagnostic Needed';
  estimatedHoursMin?: number;
  estimatedHoursMax?: number;
  diagnosticFeeCredit?: number;
  partsEstimateMin?: number;
  partsEstimateMax?: number;
  laborEstimateMin?: number;
  laborEstimateMax?: number;
  totalEstimateMin?: number;
  totalEstimateMax?: number;
  assumptions?: string[];
  recommendedTasks?: string[];
  recommendedProIds?: string[];
}
