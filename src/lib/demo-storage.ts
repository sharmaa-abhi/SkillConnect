import { useSyncExternalStore } from 'react';
import { DemoBooking, JobRequest } from '@/types/booking';
import { UserProfile } from '@/types/auth';
import { VerificationRecord, Review, Professional } from '@/types/professional';
import { initialDemoBookings, initialWorkerRequests } from '@/data/bookings';
import { professionals as staticProfessionals } from '@/data/professionals';

const FAVORITES_STORAGE_KEY = 'skillconnect_favorites';
const COMPARISON_STORAGE_KEY = 'skillconnect_comparison_pros';
const BOOKINGS_STORAGE_KEY = 'skillconnect_demo_bookings';
const REQUESTS_STORAGE_KEY = 'skillconnect_worker_requests';
const VERIFICATIONS_STORAGE_KEY = 'skillconnect_verifications';
const PROS_STORAGE_KEY = 'skillconnect_custom_pros';
const USER_STORAGE_KEY = 'skillconnect_active_user';

const defaultFavorites = ['pro-marcus-vance', 'pro-elena-rodriguez'];
const defaultComparison: string[] = [];

export const defaultCustomerUser: UserProfile = {
  id: 'usr-customer-sarah',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@example.com',
  role: 'customer',
  phone: '(555) 392-8172',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  address: '428 Castro Street, Apt 3B',
  city: 'San Francisco, CA',
  zipCode: '94114',
  joinedDate: 'March 2025',
};

export const defaultWorkerUser: UserProfile = {
  id: 'usr-worker-marcus',
  name: 'Marcus Vance',
  email: 'marcus.vance@example.com',
  role: 'worker',
  phone: '(555) 832-1984',
  avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
  address: '1540 Market St',
  city: 'San Francisco, CA',
  zipCode: '94102',
  joinedDate: 'January 2024',
  workerProfileId: 'pro-marcus-vance',
};

export const defaultAdminUser: UserProfile = {
  id: 'usr-admin-alex',
  name: 'Alex Rivera (Operations)',
  email: 'admin@skillconnect.local',
  role: 'admin',
  phone: '(555) 500-1122',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
  address: 'SkillConnect HQ, 100 Pine Street',
  city: 'San Francisco, CA',
  zipCode: '94111',
  joinedDate: 'October 2023',
};

export const initialVerificationRecords: VerificationRecord[] = [
  {
    id: 'VER-901',
    type: 'trade_license',
    title: 'California C-36 Plumbing Contractor License',
    documentNumber: 'CA-LIC #982410-C36',
    issuer: 'California Contractors State License Board (CSLB)',
    status: 'verified',
    submittedAt: '2024-02-15',
    verifiedAt: '2024-02-16',
    expiresAt: '2027-02-15',
    notes: 'Active good standing. Zero disciplinary citations on record.',
  },
  {
    id: 'VER-902',
    type: 'insurance',
    title: 'Commercial General Liability Policy ($2,000,000)',
    documentNumber: 'POL-GBC-883921',
    issuer: 'Travelers Commercial Indemnity',
    status: 'verified',
    submittedAt: '2024-02-15',
    verifiedAt: '2024-02-16',
    expiresAt: '2027-04-01',
    notes: 'Platform certificate holder endorsement on file.',
  },
  {
    id: 'VER-903',
    type: 'background_check',
    title: '7-Year Criminal History & County Courthouse Search',
    documentNumber: 'CHK-99120',
    issuer: 'Checkr National Screening',
    status: 'verified',
    submittedAt: '2024-02-16',
    verifiedAt: '2024-02-17',
    notes: 'Clear report. Identity match verified with real-time biometric liveness.',
  },
  {
    id: 'VER-904',
    type: 'trade_license',
    title: 'EPA Section 608 Universal HVAC Certification',
    documentNumber: 'EPA-608-88392',
    issuer: 'Environmental Protection Agency',
    status: 'pending',
    submittedAt: '2026-10-09',
    notes: 'Submitted for verification review by technician David Chen.',
  },
  {
    id: 'VER-905',
    type: 'trade_license',
    title: 'Journeyman Electrical License Renewal',
    documentNumber: 'CA-ELEC-44910',
    issuer: 'California DIR Standards Board',
    status: 'submitted',
    submittedAt: '2026-10-10',
    notes: 'Submitted by new applicant Roberto Ramos. Awaiting administrator review.',
  },
];

let cachedFavoritesRaw: string | null = null;
let cachedFavorites: string[] = defaultFavorites;

let cachedComparisonRaw: string | null = null;
let cachedComparison: string[] = defaultComparison;

let cachedBookingsRaw: string | null = null;
let cachedBookings: DemoBooking[] = initialDemoBookings;

let cachedRequestsRaw: string | null = null;
let cachedRequests: JobRequest[] = initialWorkerRequests;

let cachedVerificationsRaw: string | null = null;
let cachedVerifications: VerificationRecord[] = initialVerificationRecords;

let cachedProsRaw: string | null = null;
let cachedPros: Professional[] = staticProfessionals;

let cachedUserRaw: string | null = null;
let cachedUser: UserProfile = defaultCustomerUser;

function notifyStorageChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('skillconnect-storage-change'));
  }
}

function subscribeStorage(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('skillconnect-storage-change', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('skillconnect-storage-change', callback);
    window.removeEventListener('storage', callback);
  };
}

// ---------------- FAVORITES ----------------
export function getSavedFavorites(): string[] {
  if (typeof window === 'undefined') return defaultFavorites;
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return defaultFavorites;
    if (raw === cachedFavoritesRaw) return cachedFavorites;
    cachedFavoritesRaw = raw;
    cachedFavorites = JSON.parse(raw);
    return cachedFavorites;
  } catch {
    return defaultFavorites;
  }
}

export function saveFavorites(favorites: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = JSON.stringify(favorites);
    cachedFavoritesRaw = raw;
    cachedFavorites = favorites;
    localStorage.setItem(FAVORITES_STORAGE_KEY, raw);
    notifyStorageChange();
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

export function toggleFavoritePro(proId: string): boolean {
  if (typeof window === 'undefined') return false;
  const current = getSavedFavorites();
  const exists = current.includes(proId);
  const updated = exists ? current.filter((id) => id !== proId) : [...current, proId];
  saveFavorites(updated);
  return !exists;
}

// ---------------- PRO COMPARISON MATRIX ----------------
export function getSavedComparison(): string[] {
  if (typeof window === 'undefined') return defaultComparison;
  try {
    const raw = localStorage.getItem(COMPARISON_STORAGE_KEY);
    if (!raw) return defaultComparison;
    if (raw === cachedComparisonRaw) return cachedComparison;
    cachedComparisonRaw = raw;
    cachedComparison = JSON.parse(raw);
    return cachedComparison;
  } catch {
    return defaultComparison;
  }
}

export function saveComparison(comparison: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = JSON.stringify(comparison);
    cachedComparisonRaw = raw;
    cachedComparison = comparison;
    localStorage.setItem(COMPARISON_STORAGE_KEY, raw);
    notifyStorageChange();
  } catch (err) {
    console.warn('LocalStorage save comparison failed:', err);
  }
}

export function toggleComparisonPro(proId: string): { isAdded: boolean; count: number; error?: string } {
  if (typeof window === 'undefined') return { isAdded: false, count: 0 };
  const current = getSavedComparison();
  const exists = current.includes(proId);
  if (exists) {
    const updated = current.filter((id) => id !== proId);
    saveComparison(updated);
    return { isAdded: false, count: updated.length };
  } else {
    if (current.length >= 3) {
      return { isAdded: false, count: current.length, error: 'Maximum 3 professionals can be compared side-by-side.' };
    }
    const updated = [...current, proId];
    saveComparison(updated);
    return { isAdded: true, count: updated.length };
  }
}

export function clearComparison(): void {
  saveComparison([]);
}

// ---------------- BOOKINGS ----------------
export function getDemoBookings(): DemoBooking[] {
  if (typeof window === 'undefined') return initialDemoBookings;
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) {
      return initialDemoBookings;
    }
    if (raw === cachedBookingsRaw) return cachedBookings;
    cachedBookingsRaw = raw;
    cachedBookings = JSON.parse(raw);
    return cachedBookings;
  } catch {
    return initialDemoBookings;
  }
}

export function addDemoBooking(booking: DemoBooking): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getDemoBookings();
    const updated = [booking, ...current];
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));

    // Auto-generate incoming request for worker demo portal
    const currentReqs = getWorkerRequests();
    const newReq: JobRequest = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      professionalId: booking.professionalId,
      customerName: booking.customerName,
      customerNeighborhood: booking.customerAddress.split(',')[1]?.trim() || 'San Francisco',
      customerPhone: booking.customerPhone || '(555) 392-8172',
      serviceCategory: booking.categoryName,
      issueDescription: booking.serviceDescription,
      requestedDate: booking.appointmentDate,
      requestedSlot: booking.appointmentTime,
      estimatedRevenue: `$${booking.diagnosticFee} - $${booking.diagnosticFee + booking.estimatedLaborRate}`,
      status: booking.status === 'confirmed' ? 'accepted' : 'pending',
      receivedAt: 'Just now',
      associatedBookingId: booking.id,
    };
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify([newReq, ...currentReqs]));

    notifyStorageChange();
  } catch (err) {
    console.warn('LocalStorage booking save failed:', err);
  }
}

export function updateDemoBookingStatus(
  bookingId: string,
  status: DemoBooking['status'],
  cancellationReason?: string
): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getDemoBookings();
    const updated = current.map((b) => {
      if (b.id !== bookingId) return b;
      const timeline = b.timeline || [];
      const newEvent = {
        status,
        timestamp: new Date().toISOString(),
        note:
          status === 'declined'
            ? `Request declined by service professional. ${cancellationReason ? `Reason: ${cancellationReason}. ` : ''}Escrow pre-authorization hold released and refunded in full to customer.`
            : status === 'cancelled'
            ? `Booking cancelled. ${cancellationReason ? `Reason: ${cancellationReason}. ` : ''}Escrow pre-authorization hold released and refunded in full to customer.`
            : status === 'completed'
            ? 'Service completed and customer sign-off recorded. Escrow released to technician.'
            : status === 'confirmed'
            ? 'Appointment confirmed by service professional. Pre-authorized diagnostic fee held safely in escrow.'
            : status === 'disputed'
            ? `Dispute raised: ${cancellationReason || 'Mediation requested by customer'}. Escrow on administrative hold.`
            : `Status changed to ${status}.`,
      };

      const paymentStatus =
        status === 'cancelled' || status === 'declined'
          ? 'refunded_to_customer'
          : status === 'completed'
          ? 'released_to_worker'
          : status === 'disputed'
          ? 'disputed_hold'
          : status === 'confirmed'
          ? 'authorized_hold'
          : b.paymentStatus;

      return {
        ...b,
        status,
        paymentStatus,
        cancellationReason: cancellationReason || b.cancellationReason,
        timeline: [...timeline, newEvent],
      };
    });
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    notifyStorageChange();
  } catch (err) {
    console.warn('LocalStorage update failed:', err);
  }
}

export function rescheduleDemoBooking(
  bookingId: string,
  newDate: string,
  newTime: string
): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getDemoBookings();
    const updated = current.map((b) => {
      if (b.id !== bookingId) return b;
      const timeline = b.timeline || [];
      const newEvent = {
        status: b.status,
        timestamp: new Date().toISOString(),
        note: `Appointment rescheduled from ${b.appointmentDate} (${b.appointmentTime}) to ${newDate} (${newTime}).`,
      };
      return {
        ...b,
        appointmentDate: newDate,
        appointmentTime: newTime,
        timeline: [...timeline, newEvent],
      };
    });
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    notifyStorageChange();
  } catch (err) {
    console.warn('LocalStorage reschedule failed:', err);
  }
}

export function raiseDemoBookingDispute(bookingId: string, reason: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getDemoBookings();
    const updated = current.map((b) => {
      if (b.id !== bookingId) return b;
      const timeline = b.timeline || [];
      const newEvent = {
        status: 'disputed' as const,
        timestamp: new Date().toISOString(),
        note: `Dispute filed by customer: ${reason}. Escrow hold locked for administrator mediation.`,
      };
      return {
        ...b,
        status: 'disputed' as const,
        paymentStatus: 'disputed_hold' as const,
        disputeReason: reason,
        disputeFiledAt: new Date().toISOString(),
        timeline: [...timeline, newEvent],
      };
    });
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    notifyStorageChange();
  } catch (err) {
    console.warn('LocalStorage dispute failed:', err);
  }
}

export function resolveDemoBookingDispute(
  bookingId: string,
  decision: 'release_to_worker' | 'refund_to_customer',
  notes?: string
): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getDemoBookings();
    const updated = current.map((b) => {
      if (b.id !== bookingId) return b;
      const isRelease = decision === 'release_to_worker';
      const status: DemoBooking['status'] = isRelease ? 'completed' : 'cancelled';
      const paymentStatus = isRelease ? 'released_to_worker' : 'refunded_to_customer';
      const resolutionNote = isRelease
        ? `Admin Operations resolved dispute in favor of service professional. Escrow funds released. ${notes ? `Audit note: ${notes}` : ''}`
        : `Admin Operations resolved dispute in favor of homeowner. Escrow hold refunded in full. ${notes ? `Audit note: ${notes}` : ''}`;

      const timeline = b.timeline || [];
      const newEvent = {
        status,
        timestamp: new Date().toISOString(),
        note: resolutionNote,
      };

      return {
        ...b,
        status,
        paymentStatus,
        disputeResolution: resolutionNote,
        timeline: [...timeline, newEvent],
      };
    });
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    notifyStorageChange();
  } catch (err) {
    console.warn('LocalStorage resolve dispute failed:', err);
  }
}

export function addBookingReview(
  bookingId: string,
  rating: number,
  comment: string
): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getDemoBookings();
    const booking = current.find((b) => b.id === bookingId);
    if (!booking) return;

    const updated = current.map((b) =>
      b.id === bookingId
        ? { ...b, reviewed: true, userRating: rating, userReviewComment: comment }
        : b
    );
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));

    // Also inject review into the professional's profile in custom storage
    const allPros = getCustomProfessionals();
    const pro = allPros.find((p: Professional) => p.id === booking.professionalId);
    if (pro) {
      const newReview: Review = {
        id: `rev-${Date.now()}`,
        authorName: booking.customerName,
        rating,
        date: 'Today',
        comment,
        serviceType: booking.categoryName,
        verifiedBooking: true,
        createdAt: new Date().toISOString(),
      };
      const updatedReviews = [newReview, ...pro.reviews];
      const newAvgRating =
        Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(2));
      const updatedPro = {
        ...pro,
        reviews: updatedReviews,
        rating: newAvgRating,
        reviewCount: pro.reviewCount + 1,
      };
      saveCustomProfessional(updatedPro);
    }

    notifyStorageChange();
  } catch (err) {
    console.warn('LocalStorage review save failed:', err);
  }
}

// ---------------- WORKER JOB REQUESTS ----------------
export function getWorkerRequests(): JobRequest[] {
  if (typeof window === 'undefined') return initialWorkerRequests;
  try {
    const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (!raw) {
      return initialWorkerRequests;
    }
    if (raw === cachedRequestsRaw) return cachedRequests;
    cachedRequestsRaw = raw;
    cachedRequests = JSON.parse(raw);
    return cachedRequests;
  } catch {
    return initialWorkerRequests;
  }
}

export function updateJobRequestStatus(id: string, status: 'accepted' | 'declined'): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getWorkerRequests();
    const updated = current.map((r) => (r.id === id ? { ...r, status } : r));
    const raw = JSON.stringify(updated);
    cachedRequestsRaw = raw;
    cachedRequests = updated;
    localStorage.setItem(REQUESTS_STORAGE_KEY, raw);

    // Sync with booking if linked
    const linked = current.find((r) => r.id === id);
    if (linked?.associatedBookingId) {
      if (status === 'accepted') {
        updateDemoBookingStatus(
          linked.associatedBookingId,
          'confirmed',
          'Service professional confirmed the appointment slot'
        );
      } else {
        updateDemoBookingStatus(
          linked.associatedBookingId,
          'declined',
          'Professional unable to fulfill requested slot - escrow hold refunded to customer'
        );
      }
    }

    notifyStorageChange();
  } catch (err) {
    console.warn('LocalStorage update failed:', err);
  }
}

// ---------------- VERIFICATION RECORDS ----------------
export function getVerificationRecords(): VerificationRecord[] {
  if (typeof window === 'undefined') return initialVerificationRecords;
  try {
    const raw = localStorage.getItem(VERIFICATIONS_STORAGE_KEY);
    if (!raw) {
      return initialVerificationRecords;
    }
    if (raw === cachedVerificationsRaw) return cachedVerifications;
    cachedVerificationsRaw = raw;
    cachedVerifications = JSON.parse(raw);
    return cachedVerifications;
  } catch {
    return initialVerificationRecords;
  }
}

export function submitVerificationRecord(record: Omit<VerificationRecord, 'id' | 'submittedAt'>): VerificationRecord {
  const newRec: VerificationRecord = {
    ...record,
    id: `VER-${Math.floor(1000 + Math.random() * 9000)}`,
    submittedAt: new Date().toISOString().split('T')[0],
  };
  if (typeof window !== 'undefined') {
    const current = getVerificationRecords();
    const updated = [newRec, ...current];
    const raw = JSON.stringify(updated);
    cachedVerificationsRaw = raw;
    cachedVerifications = updated;
    localStorage.setItem(VERIFICATIONS_STORAGE_KEY, raw);
    notifyStorageChange();
  }
  return newRec;
}

export function updateVerificationRecordStatus(
  id: string,
  status: VerificationRecord['status'],
  notes?: string
): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getVerificationRecords();
    const updated = current.map((r) =>
      r.id === id
        ? {
            ...r,
            status,
            verifiedAt: status === 'verified' ? new Date().toISOString().split('T')[0] : r.verifiedAt,
            notes: notes !== undefined ? notes : r.notes,
          }
        : r
    );
    const raw = JSON.stringify(updated);
    cachedVerificationsRaw = raw;
    cachedVerifications = updated;
    localStorage.setItem(VERIFICATIONS_STORAGE_KEY, raw);
    notifyStorageChange();
  } catch (err) {
    console.warn('LocalStorage verification update failed:', err);
  }
}

// ---------------- CUSTOM PROFESSIONALS DATA (For live edits & replies) ----------------
export function getCustomProfessionals(): Professional[] {
  if (typeof window === 'undefined') return staticProfessionals;
  try {
    const raw = localStorage.getItem(PROS_STORAGE_KEY);
    if (!raw) {
      return staticProfessionals;
    }
    if (raw === cachedProsRaw) return cachedPros;
    cachedProsRaw = raw;
    cachedPros = JSON.parse(raw);
    return cachedPros;
  } catch {
    return staticProfessionals;
  }
}

export function saveCustomProfessional(pro: Professional): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCustomProfessionals();
    const updated = current.map((p: Professional) => (p.id === pro.id ? pro : p));
    const raw = JSON.stringify(updated);
    cachedProsRaw = raw;
    cachedPros = updated;
    localStorage.setItem(PROS_STORAGE_KEY, raw);
    notifyStorageChange();
  } catch (err) {
    console.warn('LocalStorage save pro failed:', err);
  }
}

export function replyToProReview(proId: string, reviewId: string, response: string): void {
  if (typeof window === 'undefined') return;
  const current = getCustomProfessionals();
  const pro = current.find((p: Professional) => p.id === proId);
  if (!pro) return;
  const updatedReviews = pro.reviews.map((r: Review) =>
    r.id === reviewId ? { ...r, proResponse: response } : r
  );
  saveCustomProfessional({ ...pro, reviews: updatedReviews });
}

// ---------------- ACTIVE USER SESSION ----------------
export function getActiveUser(): UserProfile {
  if (typeof window === 'undefined') return defaultCustomerUser;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return defaultCustomerUser;
    if (raw === cachedUserRaw) return cachedUser;
    cachedUserRaw = raw;
    cachedUser = JSON.parse(raw);
    return cachedUser;
  } catch {
    return defaultCustomerUser;
  }
}

export function setActiveUser(user: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = JSON.stringify(user);
    cachedUserRaw = raw;
    cachedUser = user;
    localStorage.setItem(USER_STORAGE_KEY, raw);
    notifyStorageChange();
  } catch (err) {
    console.warn('LocalStorage user save failed:', err);
  }
}

export function switchDemoRole(role: 'customer' | 'worker' | 'admin'): UserProfile {
  let target = defaultCustomerUser;
  if (role === 'worker') target = defaultWorkerUser;
  if (role === 'admin') target = defaultAdminUser;
  setActiveUser(target);
  return target;
}

// ---------------- REACT 19 SYNC EXTERNAL STORE HOOKS ----------------
export function useFavorites(): string[] {
  return useSyncExternalStore(subscribeStorage, getSavedFavorites, () => defaultFavorites);
}

export function useComparison(): string[] {
  return useSyncExternalStore(subscribeStorage, getSavedComparison, () => defaultComparison);
}

export function useBookings(): DemoBooking[] {
  return useSyncExternalStore(subscribeStorage, getDemoBookings, () => initialDemoBookings);
}

export function useWorkerRequests(): JobRequest[] {
  return useSyncExternalStore(subscribeStorage, getWorkerRequests, () => initialWorkerRequests);
}

export function useVerificationRecords(): VerificationRecord[] {
  return useSyncExternalStore(subscribeStorage, getVerificationRecords, () => initialVerificationRecords);
}

export function useActiveUser(): UserProfile {
  return useSyncExternalStore(subscribeStorage, getActiveUser, () => defaultCustomerUser);
}

export function useProfessionalsList(): Professional[] {
  return useSyncExternalStore(subscribeStorage, getCustomProfessionals, () => staticProfessionals);
}

export function resetAllDemoData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
    localStorage.removeItem(COMPARISON_STORAGE_KEY);
    localStorage.removeItem(BOOKINGS_STORAGE_KEY);
    localStorage.removeItem(REQUESTS_STORAGE_KEY);
    localStorage.removeItem(VERIFICATIONS_STORAGE_KEY);
    localStorage.removeItem(PROS_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);

    cachedFavoritesRaw = null;
    cachedFavorites = defaultFavorites;
    cachedComparisonRaw = null;
    cachedComparison = defaultComparison;
    cachedBookingsRaw = null;
    cachedBookings = initialDemoBookings;
    cachedRequestsRaw = null;
    cachedRequests = initialWorkerRequests;
    cachedVerificationsRaw = null;
    cachedVerifications = initialVerificationRecords;
    cachedProsRaw = null;
    cachedPros = staticProfessionals;
    cachedUserRaw = null;
    cachedUser = defaultCustomerUser;

    notifyStorageChange();
  } catch (err) {
    console.warn('Reset demo data failed:', err);
  }
}
