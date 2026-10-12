import assert from 'node:assert/strict';
import {
  computeCustomerMetrics,
  computeWorkerMetrics,
  computeAdminMetrics,
} from '../src/lib/metrics';
import { DemoBooking, JobRequest } from '../src/types/booking';
import { ProfessionalProfile } from '../src/types/professional';

console.log('--- RUNNING SINGLE SOURCE OF TRUTH METRICS TESTS ---');

const mockPro: ProfessionalProfile = {
  id: 'pro-marcus-vance',
  slug: 'marcus-vance',
  name: 'Marcus Vance',
  tagline: 'Master Plumber',
  tradeTitle: 'Master Plumber',
  categorySlug: 'plumbing',
  categoryName: 'Plumbing',
  rating: 4.95,
  reviewCount: 142,
  yearsInBusiness: 14,
  diagnosticFee: 65,
  hourlyRate: 85,
  priceTier: '$$',
  availableToday: true,
  serviceAreas: ['SoMa', 'Mission'],
  zipCodes: ['94107', '94110'],
  skills: ['Repiping', 'Leak Detection'],
  bio: 'Master Plumber',
  avatarUrl: '',
  coverGradient: '',
  licenseNumber: 'CA-LIC #982410-C36',
  insuranceVerified: true,
  backgroundCheckPassed: true,
  bonded: true,
  pricingItems: [],
  workingHours: [],
  reviews: [
    {
      id: 'rev-1',
      authorName: 'Alice',
      rating: 5,
      date: '2026-10-01',
      comment: 'Excellent work!',
      serviceType: 'Plumbing',
      verifiedBooking: true,
      createdAt: '2026-10-01T10:00:00Z',
    },
    {
      id: 'rev-2',
      authorName: 'Bob',
      rating: 4,
      date: '2026-10-05',
      comment: 'Very thorough.',
      serviceType: 'Plumbing',
      verifiedBooking: true,
      createdAt: '2026-10-05T10:00:00Z',
    },
  ],
};

const mockBookings: DemoBooking[] = [
  {
    id: 'BK-1',
    createdAt: '2026-10-10T10:00:00Z',
    professionalId: 'pro-marcus-vance',
    professionalName: 'Marcus Vance',
    professionalTrade: 'Plumbing',
    professionalAvatar: '',
    categoryName: 'Plumbing',
    serviceDescription: 'Sink leak',
    appointmentDate: '2026-10-13',
    appointmentTime: '10:00 AM',
    status: 'completed',
    customerName: 'Sarah Jenkins',
    customerAddress: '450 Townsend St, SF, 94107',
    diagnosticFee: 65,
    estimatedLaborRate: 85,
    paymentStatus: 'released_to_worker',
    finalTotal: 150,
  },
  {
    id: 'BK-2',
    createdAt: '2026-10-11T10:00:00Z',
    professionalId: 'pro-marcus-vance',
    professionalName: 'Marcus Vance',
    professionalTrade: 'Plumbing',
    professionalAvatar: '',
    categoryName: 'Plumbing',
    serviceDescription: 'Pipe joint replacement',
    appointmentDate: '2026-10-14',
    appointmentTime: '2:00 PM',
    status: 'confirmed',
    customerName: 'Sarah Jenkins',
    customerAddress: '450 Townsend St, SF, 94107',
    diagnosticFee: 65,
    estimatedLaborRate: 85,
    paymentStatus: 'authorized_hold',
  },
  {
    id: 'BK-3',
    createdAt: '2026-10-12T10:00:00Z',
    professionalId: 'pro-marcus-vance',
    professionalName: 'Marcus Vance',
    professionalTrade: 'Plumbing',
    professionalAvatar: '',
    categoryName: 'Plumbing',
    serviceDescription: 'Drain unclog',
    appointmentDate: '2026-10-15',
    appointmentTime: '4:00 PM',
    status: 'declined',
    customerName: 'Sarah Jenkins',
    customerAddress: '450 Townsend St, SF, 94107',
    diagnosticFee: 65,
    estimatedLaborRate: 85,
    paymentStatus: 'refunded_to_customer',
  },
];

const mockRequests: JobRequest[] = [
  {
    id: 'REQ-1',
    professionalId: 'pro-marcus-vance',
    customerName: 'Sarah Jenkins',
    customerNeighborhood: 'SoMa',
    customerPhone: '(555) 123-4567',
    serviceCategory: 'Plumbing',
    issueDescription: 'Drain unclog',
    requestedDate: '2026-10-15',
    requestedSlot: '4:00 PM',
    estimatedRevenue: '$65 - $150',
    status: 'declined',
    receivedAt: '2 hours ago',
    associatedBookingId: 'BK-3',
  },
  {
    id: 'REQ-2',
    professionalId: 'pro-marcus-vance',
    customerName: 'David Lee',
    customerNeighborhood: 'Mission',
    customerPhone: '(555) 987-6543',
    serviceCategory: 'Plumbing',
    issueDescription: 'Water heater check',
    requestedDate: '2026-10-16',
    requestedSlot: '11:00 AM',
    estimatedRevenue: '$65 - $220',
    status: 'pending',
    receivedAt: '10 mins ago',
  },
];

// Test 1: Worker metrics derived dynamically from authoritative bookings
const workerMetrics = computeWorkerMetrics(mockPro, mockRequests, mockBookings);
// Total earnings should be derived from completed booking ($150), NOT hardcoded $4,280
assert.equal(workerMetrics.totalEarnings, 150, 'Earnings must be dynamically computed from completed jobs');
assert.notEqual(workerMetrics.totalEarnings, 4280, 'Hardcoded $4,280 must be eliminated');
// Active escrow should be the confirmed booking diagnostic fee ($65)
assert.equal(workerMetrics.activeEscrowAmount, 65);
assert.equal(workerMetrics.pendingRequestsCount, 1);
assert.equal(workerMetrics.confirmedBookingsCount, 1);
assert.equal(workerMetrics.completedBookingsCount, 1);
// Rating average dynamically computed from reviews: (5 + 4) / 2 = 4.5
assert.equal(workerMetrics.averageRating, 4.5);
console.log(`✓ Worker metrics dynamically computed: earnings=$${workerMetrics.totalEarnings}, escrow=$${workerMetrics.activeEscrowAmount}, rating=${workerMetrics.averageRating}`);

// Test 2: Customer metrics derived from same bookings list
const customerMetrics = computeCustomerMetrics(mockBookings, ['pro-marcus-vance']);
assert.equal(customerMetrics.activeAppointmentsCount, 1); // BK-2 is confirmed
assert.equal(customerMetrics.completedBookingsCount, 1); // BK-1 is completed
assert.equal(customerMetrics.savedProsCount, 1);
assert.equal(customerMetrics.activeEscrowTotal, 65); // only BK-2 has active hold
console.log(`✓ Customer metrics derived from same source: active=${customerMetrics.activeAppointmentsCount}, completed=${customerMetrics.completedBookingsCount}, escrowHeld=$${customerMetrics.activeEscrowTotal}`);

// Test 3: Admin metrics derived from same source
const adminMetrics = computeAdminMetrics([mockPro], [], mockBookings);
assert.equal(adminMetrics.totalBookingsCount, 3);
assert.equal(adminMetrics.completedBookingsCount, 1);
assert.equal(adminMetrics.activeEscrowTotal, 65);
console.log(`✓ Admin metrics match Customer and Worker figures: bookings=${adminMetrics.totalBookingsCount}, escrowHeld=$${adminMetrics.activeEscrowTotal}`);

console.log('ALL SINGLE SOURCE OF TRUTH METRICS TESTS PASSED!\n');
