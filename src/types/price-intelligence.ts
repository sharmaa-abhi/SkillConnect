export type GeographicScope = 'local' | 'state' | 'national' | 'unspecified';

export interface MarketPriceRange {
  min: number;
  max: number;
  unit?: string;
  isHourly?: boolean;
}

export interface MarketReferenceSource {
  title: string;
  url: string;
  domain: string;
  datePublished?: string;
  priceRange?: MarketPriceRange;
  geographicScope: GeographicScope;
  relevanceNote: string;
  pricingBasis?: string;
  snippet?: string;
  sampleQuote?: string;
}

export type EvidenceConfidence =
  | 'sufficient'
  | 'weak'
  | 'contradictory'
  | 'outdated'
  | 'insufficient_local';

export interface PriceEvidenceAssessment {
  status: EvidenceConfidence;
  assessmentMessage: string;
  marketLow?: number;
  marketHigh?: number;
  marketMedian?: number;
  currency: 'USD';
  sampleSize: number;
  isLocalitySpecific: boolean;
}

export type PriceIntelligenceStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'no_evidence'
  | 'weak_evidence'
  | 'contradictory'
  | 'unsupported_trade'
  | 'quota_exhausted'
  | 'rate_limited'
  | 'unavailable'
  | 'error';

export interface PriceIntelligenceResult {
  serviceDescription: string;
  tradeCategory: string;
  zipCode: string;
  localityName?: string;
  status: PriceIntelligenceStatus;
  statusMessage: string;
  sources: MarketReferenceSource[];
  evidence: PriceEvidenceAssessment;
  disclaimer: string;
  providerNotice: string;
  cachedAt?: string;
  isCached?: boolean;
}

export interface PriceIntelligenceSearchRequest {
  problemDescription: string;
  categorySlug?: string;
  zipCode: string;
}

export interface PriceIntelligenceFetchRequest {
  url: string;
  categorySlug?: string;
  zipCode?: string;
}

export interface TinyFishSearchResultItem {
  title: string;
  url: string;
  snippet?: string;
  date?: string;
  score?: number;
}

export interface TinyFishSearchResponse {
  results: TinyFishSearchResultItem[];
  query: string;
  error?: string;
}

export interface TinyFishFetchResponse {
  url: string;
  content: string;
  status?: number;
  error?: string;
}
