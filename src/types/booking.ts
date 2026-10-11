export type BookingStatus = 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentHoldStatus = 'authorized_hold' | 'released_to_worker' | 'refunded_to_customer';

export interface BookingTimelineEvent {
  status: BookingStatus;
  timestamp: string;
  note: string;
}

export interface DemoBooking {
  id: string; // e.g. DEMO-BOOK-1042
  createdAt: string;
  professionalId: string;
  professionalName: string;
  professionalTrade: string;
  professionalAvatar: string;
  categoryName: string;
  serviceDescription: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress: string;
  appointmentDate: string; // e.g. "Tomorrow, Oct 6"
  appointmentTime: string; // e.g. "10:00 AM"
  diagnosticFee: number;
  estimatedLaborRate: number;
  selectedServiceTitle?: string;
  totalEstimateLow: number;
  totalEstimateHigh: number;
  taxAmount?: number;
  paymentStatus?: PaymentHoldStatus;
  status: BookingStatus;
  timeline?: BookingTimelineEvent[];
  cancellationReason?: string;
  reviewed?: boolean;
  userRating?: number;
  userReviewComment?: string;
  isDemoOnly: true;
}

export interface JobRequest {
  id: string;
  customerName: string;
  customerNeighborhood: string;
  customerPhone?: string;
  serviceCategory: string;
  issueDescription: string;
  requestedDate: string;
  requestedSlot: string;
  estimatedRevenue: string;
  status: 'pending' | 'accepted' | 'declined';
  receivedAt: string;
  associatedBookingId?: string;
}
