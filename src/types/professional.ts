export interface Review {
  id: string;
  authorName: string;
  rating: number;
  date: string;
  comment: string;
  serviceType: string;
  verifiedBooking: boolean;
  proResponse?: string;
  createdAt?: string;
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

export type VerificationStatusType = 'submitted' | 'pending' | 'verified' | 'rejected' | 'expired';

export interface VerificationRecord {
  id: string;
  type: 'trade_license' | 'insurance' | 'government_id' | 'background_check';
  title: string;
  documentNumber?: string;
  issuer?: string;
  status: VerificationStatusType;
  submittedAt: string;
  verifiedAt?: string;
  expiresAt?: string;
  notes?: string;
  documentUrl?: string;
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
  insuranceStatus: 'Verified Active' | 'Pending Verification' | 'Rejected' | 'Expired';
  verifiedPro: boolean;
  backgroundChecked: boolean;
  verificationStatus?: VerificationStatusType;
  verificationRecords?: VerificationRecord[];
  completedJobsCount: number;
  responseRate: string;
  workingHours: WorkingHour[];
  pricingItems: ServicePriceItem[];
  reviews: Review[];
  featured?: boolean;
}

export type Professional = ProfessionalProfile;
