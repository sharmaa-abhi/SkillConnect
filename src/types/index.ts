export * from './service';
export * from './professional';
export * from './booking';

export interface FilterState {
  query: string;
  category: string;
  minRating: number | null; // e.g. 4.0, 4.5
  availableToday: boolean;
  priceTier: string; // 'all' | '$' | '$$' | '$$$'
  sortBy: 'recommended' | 'rating' | 'price-asc';
}
