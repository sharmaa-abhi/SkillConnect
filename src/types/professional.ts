export interface Review {
  id: string;
  authorName: string;
  rating: number;
  date: string;
  comment: string;
  serviceType: string;
  verifiedBooking: boolean;
  proResponse?: string;
}

export interface ServicePriceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  unit: 'hr' | 'fixed' | 'diagnostic';
}

export interface WorkingHour {
  day: string;
  hours: string;
  isAvailable: boolean;
}

export interface ProfessionalProfile {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  tradeTitle: string;
  categorySlug: string;
  categoryName: string;
  rating: number;
  reviewCount: number;
  yearsInBusiness: number;
  diagnosticFee: number;
  hourlyRate: number;
  priceTier: '$' | '$$' | '$$$'; // $: <$60/hr, $$: $60-$90/hr, $$$: $90+/hr
  availableToday: boolean;
  serviceAreas: string[];
  zipCodes: string[];
  skills: string[];
  bio: string;
  avatarUrl: string;
  coverGradient?: string;
  licenseNumber: string;
  insuranceStatus: 'Verified Active' | 'Pending Verification';
  verifiedPro: boolean;
  backgroundChecked: boolean;
  completedJobsCount: number;
  responseRate: string;
  workingHours: WorkingHour[];
  pricingItems: ServicePriceItem[];
  reviews: Review[];
  featured?: boolean;
}
