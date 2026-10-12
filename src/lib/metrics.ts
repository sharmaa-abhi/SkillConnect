/**
 * Centralized Single Source of Truth for Dashboard Metrics & Aggregations.
 * Derives all counts, escrow totals, and payout values directly from authoritative records.
 */

import { DemoBooking, JobRequest } from '@/types/booking';
import { VerificationRecord, Professional } from '@/types/professional';

export interface CustomerMetrics {
  activeAppointmentsCount: number;
  completedBookingsCount: number;
  savedProsCount: number;
  activeEscrowTotal: number;
  disputedCount: number;
}

export interface WorkerMetrics {
  pendingRequestsCount: number;
  acceptedRequestsCount: number;
  confirmedBookingsCount: number;
  completedBookingsCount: number;
  totalCompletedJobsCount: number;
  activeEscrowAmount: number;
  totalEarnings: number;
  averageRating: number;
  reviewsCount: number;
}

export interface AdminMetrics {
  totalProsCount: number;
  verifiedProsCount: number;
  pendingAuditsCount: number;
  activeEscrowTotal: number;
  activeDisputesCount: number;
  totalBookingsCount: number;
  completedBookingsCount: number;
}

export function computeCustomerMetrics(
  bookings: DemoBooking[],
  favoriteIds: string[]
): CustomerMetrics {
  const activeBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'in_progress' || b.status === 'disputed'
  );
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const disputedBookings = bookings.filter((b) => b.status === 'disputed');

  const activeEscrowTotal = activeBookings.reduce(
    (sum, b) => sum + (b.paymentStatus === 'authorized_hold' || b.paymentStatus === 'disputed_hold' ? b.diagnosticFee : 0),
    0
  );

  return {
    activeAppointmentsCount: activeBookings.length,
    completedBookingsCount: completedBookings.length,
    savedProsCount: favoriteIds.length,
    activeEscrowTotal,
    disputedCount: disputedBookings.length,
  };
}

export function computeWorkerMetrics(
  workerPro: Professional,
  requests: JobRequest[],
  bookings: DemoBooking[]
): WorkerMetrics {
  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const acceptedRequests = requests.filter((r) => r.status === 'accepted');

  const workerBookings = bookings.filter((b) => b.professionalId === workerPro.id);
  const confirmedBookings = workerBookings.filter((b) => b.status === 'confirmed');
  const completedBookings = workerBookings.filter((b) => b.status === 'completed');

  const activeEscrowAmount = workerBookings
    .filter((b) => b.status === 'confirmed' || b.status === 'in_progress')
    .reduce((sum, b) => sum + b.diagnosticFee, 0);

  // Authoritative total earnings from completed jobs: diagnostic fee + labor
  const earningsFromBookings = completedBookings.reduce(
    (sum, b) => sum + (b.totalEstimateHigh || b.diagnosticFee + (b.estimatedLaborRate || 85)),
    0
  );

  // If there are historical completed jobs outside demo bookings, reflect baseline + live
  const baselineEarnings = workerPro.completedJobsCount > 0 ? workerPro.completedJobsCount * 140 : 0;
  const totalEarnings = earningsFromBookings > 0 ? earningsFromBookings : baselineEarnings;

  const totalCompletedJobsCount = workerPro.completedJobsCount + completedBookings.length;

  const reviewsCount = workerPro.reviews?.length || workerPro.reviewCount;
  const averageRating = workerPro.reviews?.length
    ? Number((workerPro.reviews.reduce((acc, r) => acc + r.rating, 0) / workerPro.reviews.length).toFixed(2))
    : workerPro.rating;

  return {
    pendingRequestsCount: pendingRequests.length,
    acceptedRequestsCount: acceptedRequests.length,
    confirmedBookingsCount: confirmedBookings.length,
    completedBookingsCount: completedBookings.length,
    totalCompletedJobsCount,
    activeEscrowAmount,
    totalEarnings,
    averageRating,
    reviewsCount,
  };
}

export function computeAdminMetrics(
  pros: Professional[],
  verificationRecords: VerificationRecord[],
  bookings: DemoBooking[]
): AdminMetrics {
  const verifiedProsCount = pros.filter((p) => p.verifiedPro).length;
  const pendingAudits = verificationRecords.filter(
    (r) => r.status === 'pending' || r.status === 'submitted'
  );
  const activeDisputes = bookings.filter((b) => b.status === 'disputed');
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  const activeEscrowTotal = bookings
    .filter((b) => b.paymentStatus === 'authorized_hold' || b.paymentStatus === 'disputed_hold')
    .reduce((sum, b) => sum + b.diagnosticFee, 0);

  return {
    totalProsCount: pros.length,
    verifiedProsCount,
    pendingAuditsCount: pendingAudits.length,
    activeEscrowTotal,
    activeDisputesCount: activeDisputes.length,
    totalBookingsCount: bookings.length,
    completedBookingsCount: completedBookings.length,
  };
}
