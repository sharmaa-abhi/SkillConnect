export type BookingStatus = 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

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
  customerPhone?: string;
  customerAddress: string;
  appointmentDate: string; // formatted e.g. "Tomorrow, Oct 6"
  appointmentTime: string; // e.g. "10:00 AM"
  diagnosticFee: number;
  estimatedLaborRate: number;
  totalEstimateLow: number;
  totalEstimateHigh: number;
  status: BookingStatus;
  isDemoOnly: true;
}

export interface JobRequest {
  id: string;
  customerName: string;
  customerNeighborhood: string;
  serviceCategory: string;
  issueDescription: string;
  requestedDate: string;
  requestedSlot: string;
  estimatedRevenue: string;
  status: 'pending' | 'accepted' | 'declined';
  receivedAt: string;
}
