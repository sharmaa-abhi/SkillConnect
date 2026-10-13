import assert from 'node:assert/strict';
import { DemoBooking } from '../src/types/booking';

console.log('--- RUNNING SHARED STATE & ESCROW TRANSITION TESTS ---');

// State transition reducer simulating authoritative backend / storage logic
function applyBookingTransition(
  booking: DemoBooking,
  newStatus: DemoBooking['status'],
  reason?: string
): DemoBooking {
  const allowedTransitions: Record<DemoBooking['status'], DemoBooking['status'][]> = {
    pending: ['confirmed', 'declined', 'cancelled'],
    confirmed: ['in_progress', 'cancelled', 'disputed'],
    in_progress: ['completed', 'disputed', 'cancelled'],
    completed: ['disputed'],
    declined: [], // terminal state
    cancelled: [], // terminal state
    disputed: ['completed', 'cancelled'],
  };

  const currentAllowed = allowedTransitions[booking.status] || [];
  if (!currentAllowed.includes(newStatus)) {
    throw new Error(`Illegal state transition from ${booking.status} to ${newStatus}`);
  }

  let paymentStatus = booking.paymentStatus;
  let timelineNote = '';

  if (newStatus === 'declined') {
    // CRITICAL ESCROW SAFETY: When pro declines, funds are REFUNDED TO CUSTOMER, never to worker
    paymentStatus = 'refunded_to_customer';
    timelineNote = `Request declined by pro. ${reason || ''} Escrow pre-authorization hold released and refunded in full to customer.`;
  } else if (newStatus === 'cancelled') {
    paymentStatus = 'refunded_to_customer';
    timelineNote = `Booking cancelled. ${reason || ''} Escrow pre-authorization hold refunded to customer.`;
  } else if (newStatus === 'confirmed') {
    paymentStatus = 'authorized_hold';
    timelineNote = 'Appointment confirmed. Escrow hold maintained securely.';
  } else if (newStatus === 'completed') {
    paymentStatus = 'released_to_worker';
    timelineNote = 'Job completed and signed off. Escrow released to technician.';
  }

  const timelineEvent = {
    status: newStatus,
    timestamp: new Date().toISOString(),
    note: timelineNote,
  };

  return {
    ...booking,
    status: newStatus,
    paymentStatus,
    cancellationReason: reason || booking.cancellationReason,
    timeline: [...(booking.timeline || []), timelineEvent],
  };
}

// Baseline mock booking
const mockPendingBooking: DemoBooking = {
  id: 'BK-TEST-101',
  createdAt: '2026-10-12T10:00:00Z',
  professionalId: 'pro-marcus-vance',
  professionalName: 'Marcus Vance',
  professionalTrade: 'Plumbing',
  professionalAvatar: '',
  categoryName: 'Plumbing',
  serviceDescription: 'Leaky kitchen sink pipe joint',
  appointmentDate: '2026-10-13',
  appointmentTime: '10:00 AM - 12:00 PM',
  status: 'pending',
  customerName: 'Sarah Jenkins',
  customerAddress: '450 Townsend St, San Francisco, CA 94107',
  diagnosticFee: 65,
  estimatedLaborRate: 85,
  totalEstimateLow: 65,
  totalEstimateHigh: 180,
  isDemoOnly: true,
  paymentStatus: 'authorized_hold',
  timeline: [
    {
      status: 'pending',
      timestamp: '2026-10-12T10:00:00Z',
      note: 'Booking requested by homeowner. Pre-authorization hold of $65 placed in escrow.',
    },
  ],
};

// Test 1: Pro declines request -> Status: declined, Payment: refunded_to_customer
const declinedBooking = applyBookingTransition(
  mockPendingBooking,
  'declined',
  'Emergency schedule conflict'
);

assert.equal(declinedBooking.status, 'declined');
assert.equal(declinedBooking.paymentStatus, 'refunded_to_customer');
assert.notEqual(
  declinedBooking.paymentStatus,
  'released_to_worker',
  'SAFETY: Declining pro must NEVER receive customer funds'
);
assert(declinedBooking.timeline && declinedBooking.timeline.length > 0);
assert(
  declinedBooking.timeline[declinedBooking.timeline.length - 1].note.includes('refunded in full to customer')
);
console.log('✓ Pro decline transition: Booking marked "declined" and escrow refunded to customer');

// Test 2: Pro accepts request -> Status: confirmed, Payment remains authorized_hold
const confirmedBooking = applyBookingTransition(
  mockPendingBooking,
  'confirmed',
  'Slot accepted'
);
assert.equal(confirmedBooking.status, 'confirmed');
assert.equal(confirmedBooking.paymentStatus, 'authorized_hold');
console.log('✓ Pro accept transition: Booking marked "confirmed" and escrow hold retained');

// Test 3: Completed service -> Escrow released to technician
const inProgressBooking = applyBookingTransition(confirmedBooking, 'in_progress');
const completedBooking = applyBookingTransition(inProgressBooking, 'completed', 'Homeowner approved');
assert.equal(completedBooking.status, 'completed');
assert.equal(completedBooking.paymentStatus, 'released_to_worker');
console.log('✓ Job completion: Escrow released to technician upon sign-off');

// Test 4: Prevent illegal transition (declined -> confirmed)
assert.throws(() => {
  applyBookingTransition(declinedBooking, 'confirmed');
}, /Illegal state transition/);
console.log('✓ Terminal state transition protection prevented re-activating a declined booking');

console.log('ALL STATE TRANSITION & ESCROW TESTS PASSED!\n');
