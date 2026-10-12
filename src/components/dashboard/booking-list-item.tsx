'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  X,
} from 'lucide-react';
import { DemoBooking } from '@/types/booking';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/toast-context';
import { addBookingReview, rescheduleDemoBooking, raiseDemoBookingDispute } from '@/lib/demo-storage';
import { AlertTriangle } from 'lucide-react';

export interface BookingListItemProps {
  booking: DemoBooking;
  onCancelBooking?: (bookingId: string) => void;
}

export function BookingListItem({ booking, onCancelBooking }: BookingListItemProps) {
  const { showToast } = useToast();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Reschedule Dialog State
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [newDateInput, setNewDateInput] = useState(booking.appointmentDate);
  const [newTimeInput, setNewTimeInput] = useState(booking.appointmentTime);

  // Dispute Dialog State
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeReasonInput, setDisputeReasonInput] = useState('');
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rescheduleDemoBooking(booking.id, newDateInput, newTimeInput);
    setRescheduleModalOpen(false);
    showToast({
      type: 'success',
      title: 'Appointment Rescheduled',
      message: `Your booking #${booking.id} with ${booking.professionalName} is now set for ${newDateInput} at ${newTimeInput}.`,
    });
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReasonInput.trim()) {
      showToast({
        type: 'error',
        title: 'Dispute Reason Required',
        message: 'Please provide details explaining why you are requesting escrow mediation.',
      });
      return;
    }
    setIsSubmittingDispute(true);
    setTimeout(() => {
      raiseDemoBookingDispute(booking.id, disputeReasonInput.trim());
      setIsSubmittingDispute(false);
      setDisputeModalOpen(false);
      showToast({
        type: 'info',
        title: 'Dispute Filed with Trust Desk',
        message: `Booking #${booking.id} has been submitted for administrative escrow mediation under our $2,500 guarantee.`,
      });
    }, 400);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast({
        type: 'error',
        title: 'Review Required',
        message: 'Please write a brief comment describing your service experience.',
      });
      return;
    }

    setIsSubmittingReview(true);
    setTimeout(() => {
      addBookingReview(booking.id, reviewRating, reviewComment.trim());
      setIsSubmittingReview(false);
      setReviewModalOpen(false);
      showToast({
        type: 'success',
        title: 'Review Published',
        message: `Your verified review for ${booking.professionalName} has been recorded.`,
      });
    }, 400);
  };

  const isPending = booking.status === 'pending';
  const isUpcoming = booking.status === 'confirmed' || booking.status === 'in_progress';
  const isCancelled = booking.status === 'cancelled';
  const isDeclined = booking.status === 'declined';
  const isCompleted = booking.status === 'completed';
  const isDisputed = booking.status === 'disputed';

  return (
    <>
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#E4E7EC] hover:border-[#D0D5DD] shadow-2xs hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          {/* Pro Avatar */}
          <div className="relative w-14 h-14 rounded-2xl bg-[#173B67] text-white flex items-center justify-center font-bold text-lg flex-shrink-0 overflow-hidden shadow-2xs">
            {booking.professionalAvatar ? (
              <img
                src={booking.professionalAvatar}
                alt={booking.professionalName}
                className="w-full h-full object-cover"
              />
            ) : (
              booking.professionalName[0]
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-[#173B67]">
                #{booking.id}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                  isPending
                    ? 'bg-amber-50 text-[#B54708] border border-amber-200'
                    : isDeclined
                    ? 'bg-rose-50 text-[#B42318] border border-rose-200'
                    : isUpcoming
                    ? 'bg-blue-50 text-[#173B67] border border-blue-200'
                    : isDisputed
                    ? 'bg-red-50 text-[#B42318] border border-red-200'
                    : isCancelled
                    ? 'bg-gray-100 text-[#667085] border border-gray-200'
                    : 'bg-emerald-50 text-[#15803D] border border-emerald-200'
                }`}
              >
                {isPending
                  ? 'Awaiting Pro Acceptance'
                  : isDeclined
                  ? 'Declined by Pro'
                  : isDisputed
                  ? 'Dispute in Mediation'
                  : booking.status.replace('_', ' ')}
              </span>
              <span className="text-[11px] text-[#0F9D91] font-semibold bg-[#E6F7F5] px-2 py-0.5 rounded-md">
                {booking.categoryName}
              </span>
              {booking.reviewed && (
                <span className="text-[11px] font-semibold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#E7A83E] text-[#E7A83E]" />
                  <span>Reviewed ({booking.userRating}★)</span>
                </span>
              )}
            </div>

            <h4 className="text-base font-bold text-[#263445]">
              {booking.professionalName}
            </h4>
            <p className="text-xs text-[#667085] mb-2">{booking.professionalTrade}</p>

            <p className="text-xs text-[#263445] font-medium line-clamp-1 mb-3 bg-[#F7F8FA] p-2 rounded-lg border border-[#E4E7EC]">
              &ldquo;{booking.serviceDescription}&rdquo;
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#667085]">
              <div className="flex items-center gap-1.5 font-semibold text-[#173B67]">
                <Calendar className="w-3.5 h-3.5 text-[#0F9D91]" />
                <span>{booking.appointmentDate}</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-[#173B67]">
                <Clock className="w-3.5 h-3.5 text-[#0F9D91]" />
                <span>{booking.appointmentTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#667085]" />
                <span className="truncate max-w-[200px]">{booking.customerAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Action Controls */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#E4E7EC]">
          <div className="text-left md:text-right">
            <span className="text-[11px] text-[#667085] block">Diagnostic Escrow Hold</span>
            <p className="text-base font-extrabold text-[#173B67]">
              {formatCurrency(booking.diagnosticFee)}
            </p>
            <span className="text-[10px] text-[#0F9D91] font-semibold">
              {booking.paymentStatus === 'released_to_worker'
                ? 'Released upon sign-off'
                : booking.paymentStatus === 'refunded_to_customer'
                ? 'Pre-authorization released'
                : booking.paymentStatus === 'disputed_hold'
                ? 'Mediation Hold ($2,500 Guarantee)'
                : 'Escrow protected'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDetailsOpen(true)}
              className="text-xs"
            >
              Details
            </Button>

            {isUpcoming && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewDateInput(booking.appointmentDate);
                    setNewTimeInput(booking.appointmentTime);
                    setRescheduleModalOpen(true);
                  }}
                  className="text-xs"
                >
                  Reschedule
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDisputeModalOpen(true)}
                  className="text-xs text-amber-700 hover:bg-amber-50"
                  title="Raise escrow dispute or request mediation"
                >
                  Dispute
                </Button>
                {onCancelBooking && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCancelBooking(booking.id)}
                    className="text-xs text-[#B42318] hover:bg-red-50 hover:text-[#B42318]"
                  >
                    Cancel
                  </Button>
                )}
              </>
            )}

            {isCompleted && (
              <div className="flex items-center gap-1.5">
                {!booking.reviewed && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setReviewModalOpen(true)}
                    className="text-xs font-semibold"
                  >
                    Leave Review
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDisputeModalOpen(true)}
                  className="text-xs text-[#667085] hover:text-[#B42318] hover:bg-red-50"
                  title="Report workmanship defect under $2,500 guarantee"
                >
                  Dispute
                </Button>
              </div>
            )}

            {isDisputed && (
              <span className="text-xs font-bold text-[#B42318] bg-red-50 px-2.5 py-1 rounded-xl border border-red-200 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Admin Mediation Active</span>
              </span>
            )}

            {isCancelled && (
              <span className="text-xs text-[#667085] italic">
                Cancelled
              </span>
            )}
          </div>
        </div>
      </div>

      {/* DETAILS MODAL */}
      {detailsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E4E7EC] shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC]">
              <div>
                <h3 className="font-bold text-lg text-[#173B67]">Appointment Details</h3>
                <p className="text-xs text-[#667085]">Booking Reference: #{booking.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailsOpen(false)}
                className="p-1 rounded-lg text-[#667085] hover:bg-[#F7F8FA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E4E7EC] flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-[#667085]">Professional:</span>
                  <span className="font-bold text-[#263445]">{booking.professionalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Trade:</span>
                  <span className="font-semibold text-[#263445]">{booking.professionalTrade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Appointment:</span>
                  <span className="font-bold text-[#173B67]">
                    {booking.appointmentDate} at {booking.appointmentTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Service Address:</span>
                  <span className="font-medium text-[#263445] text-right">{booking.customerAddress}</span>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="p-4 rounded-2xl border border-[#E4E7EC] space-y-2">
                <div className="font-bold text-[#173B67] text-xs uppercase tracking-wider mb-2">
                  Financial & Escrow Status
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Diagnostic Fee Pre-Authorization:</span>
                  <span className="font-bold text-[#263445]">{formatCurrency(booking.diagnosticFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Estimated Labor Rate:</span>
                  <span className="font-semibold text-[#263445]">{formatCurrency(booking.estimatedLaborRate)}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Estimated Total Window:</span>
                  <span className="font-bold text-[#173B67]">
                    {formatCurrency(booking.totalEstimateLow)} – {formatCurrency(booking.totalEstimateHigh)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E4E7EC]">
                  <span className="text-[#667085]">Escrow Status:</span>
                  <span className="font-bold text-[#0F9D91] capitalize">
                    {booking.paymentStatus?.replace(/_/g, ' ') || 'Authorized Hold'}
                  </span>
                </div>
              </div>

              {/* Activity Timeline */}
              {booking.timeline && booking.timeline.length > 0 && (
                <div>
                  <h5 className="font-bold text-xs uppercase text-[#667085] tracking-wider mb-2">
                    Service Activity Timeline
                  </h5>
                  <div className="border-l-2 border-[#E4E7EC] pl-4 space-y-3">
                    {booking.timeline.map((event, i) => (
                      <div key={i} className="relative">
                        <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#173B67]" />
                        <span className="text-[11px] text-[#667085] block">
                          {new Date(event.timestamp).toLocaleDateString()} {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <p className="text-xs text-[#263445] font-medium">{event.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E4E7EC] flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* LEAVE REVIEW MODAL */}
      {reviewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleReviewSubmit}
            className="relative w-full max-w-md bg-white rounded-3xl border border-[#E4E7EC] shadow-2xl p-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC] mb-4">
              <div>
                <h3 className="font-bold text-base text-[#173B67]">
                  Review {booking.professionalName}
                </h3>
                <p className="text-xs text-[#667085]">Verified service on #{booking.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="p-1 rounded-lg text-[#667085] hover:bg-[#F7F8FA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#263445] uppercase tracking-wider mb-2">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating
                            ? 'fill-[#E7A83E] text-[#E7A83E]'
                            : 'text-[#D0D5DD]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#263445] ml-2">
                    {reviewRating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263445] uppercase tracking-wider mb-1.5">
                  Your Review & Feedback
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe the technician's punctuality, quality of work, cleanup, and communication..."
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#E6F7F5] border border-[#0F9D91]/20 text-[11px] text-[#0F9D91] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Verified Review:</strong> Because this booking was executed through SkillConnect, your review will display with a &ldquo;Verified Job&rdquo; trust badge.
                </span>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#E4E7EC] flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setReviewModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmittingReview}
              >
                Publish Review
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {rescheduleModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleRescheduleSubmit}
            className="relative w-full max-w-md bg-white rounded-3xl border border-[#E4E7EC] shadow-2xl p-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC] mb-4">
              <div>
                <h3 className="font-bold text-base text-[#173B67]">
                  Reschedule Appointment
                </h3>
                <p className="text-xs text-[#667085]">
                  With {booking.professionalName} (#{booking.id})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRescheduleModalOpen(false)}
                className="p-1 rounded-lg text-[#667085] hover:bg-[#F7F8FA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#263445] uppercase tracking-wider mb-1.5">
                  Select New Arrival Date
                </label>
                <select
                  value={newDateInput}
                  onChange={(e) => setNewDateInput(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-[#D0D5DD] bg-white focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                >
                  <option value="Tomorrow, Oct 12">Tomorrow, Oct 12</option>
                  <option value="Wednesday, Oct 13">Wednesday, Oct 13</option>
                  <option value="Thursday, Oct 14">Thursday, Oct 14</option>
                  <option value="Friday, Oct 15">Friday, Oct 15</option>
                  <option value="Saturday, Oct 16">Saturday, Oct 16</option>
                  <option value="Monday, Oct 18">Monday, Oct 18</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263445] uppercase tracking-wider mb-1.5">
                  Select Arrival Window
                </label>
                <select
                  value={newTimeInput}
                  onChange={(e) => setNewTimeInput(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-[#D0D5DD] bg-white focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                >
                  <option value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM (Morning)</option>
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM (Morning)</option>
                  <option value="1:00 PM - 3:00 PM">1:00 PM - 3:00 PM (Afternoon)</option>
                  <option value="3:30 PM - 5:30 PM">3:30 PM - 5:30 PM (Afternoon)</option>
                  <option value="5:30 PM - 7:30 PM">5:30 PM - 7:30 PM (Evening)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E4E7EC] text-xs text-[#667085] leading-relaxed">
                Your diagnostic hold of {formatCurrency(booking.diagnosticFee)} remains safely locked in escrow with no re-booking penalties.
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-[#E4E7EC] flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRescheduleModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Confirm Reschedule
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* DISPUTE MEDIATION FILING MODAL */}
      {disputeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleDisputeSubmit}
            className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E4E7EC] shadow-2xl p-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-[#B42318] flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#173B67]">
                    Request Escrow Dispute Mediation
                  </h3>
                  <p className="text-xs text-[#667085]">Booking #{booking.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDisputeModalOpen(false)}
                className="p-1 rounded-lg text-[#667085] hover:bg-[#F7F8FA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-[#263445] leading-relaxed">
                <strong>$2,500 SkillConnect Craftsmanship Guarantee:</strong> Submitting this dispute places your diagnostic fee hold of {formatCurrency(booking.diagnosticFee)} on administrative pause. Our Operations Desk will mediate within 24 hours.
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263445] uppercase tracking-wider mb-1.5">
                  Explain the Issue / Ground for Mediation: <span className="text-[#B42318]">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={disputeReasonInput}
                  onChange={(e) => setDisputeReasonInput(e.target.value)}
                  placeholder="Describe what occurred (e.g. technician arrived significantly late, did not possess required diagnostic tools, or workmanship failed within warranty window)..."
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                />
              </div>

              <div className="text-[11px] text-[#667085]">
                Both customer and service professional accounts will receive mediation updates in their respective dashboards.
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-[#E4E7EC] flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDisputeModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmittingDispute}
                className="bg-[#B42318] hover:bg-[#912018]"
              >
                Submit Dispute to Admin Desk
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
