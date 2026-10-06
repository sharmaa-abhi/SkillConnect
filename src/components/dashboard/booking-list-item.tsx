'use client';

import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { DemoBooking } from '@/types/booking';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/toast-context';

export interface BookingListItemProps {
  booking: DemoBooking;
  onCancelBooking?: (bookingId: string) => void;
}

export function BookingListItem({ booking, onCancelBooking }: BookingListItemProps) {
  const { showToast } = useToast();

  const handleReschedule = () => {
    showToast({
      type: 'info',
      title: 'Reschedule Requested',
      message: `A demo reschedule inquiry has been submitted for booking #${booking.id}.`,
    });
  };

  const handleReview = () => {
    showToast({
      type: 'success',
      title: 'Rating Submitted (Demo)',
      message: `Thank you for reviewing ${booking.professionalName}!`,
    });
  };

  const isUpcoming = booking.status === 'confirmed' || booking.status === 'in_progress';
  const isCancelled = booking.status === 'cancelled';
  const isCompleted = booking.status === 'completed';

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#e3e8e3] hover:border-[#c8d3cc] shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-5">
      <div className="flex items-start gap-4">
        {/* Pro Avatar */}
        <div className="relative w-12 h-12 rounded-xl bg-[#143d35] text-white flex items-center justify-center font-bold text-lg flex-shrink-0 overflow-hidden">
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
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-mono text-xs font-semibold text-[#66716d]">
              #{booking.id}
            </span>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                isUpcoming
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : isCancelled
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              {booking.status.replace('_', ' ')}
            </span>
            <span className="text-[11px] text-[#237a63] font-medium bg-[#e7f4ed] px-2 py-0.5 rounded-md">
              {booking.categoryName}
            </span>
          </div>

          <h4 className="text-base font-bold text-[#172522]">
            {booking.professionalName}
          </h4>
          <p className="text-xs text-[#66716d] mb-2">{booking.professionalTrade}</p>

          <p className="text-xs text-[#172522] font-medium line-clamp-1 mb-3">
            &ldquo;{booking.serviceDescription}&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#66716d]">
            <div className="flex items-center gap-1.5 font-medium text-[#143d35]">
              <Calendar className="w-3.5 h-3.5 text-[#237a63]" />
              <span>{booking.appointmentDate}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-[#143d35]">
              <Clock className="w-3.5 h-3.5 text-[#237a63]" />
              <span>{booking.appointmentTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#66716d]" />
              <span className="truncate max-w-[200px]">{booking.customerAddress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Pricing & Action Controls */}
      <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#e3e8e3]">
        <div className="text-left md:text-right">
          <span className="text-xs text-[#66716d]">Diagnostic Hold</span>
          <p className="text-base font-bold text-[#143d35]">
            {formatCurrency(booking.diagnosticFee)}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isUpcoming && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReschedule}
                className="text-xs"
              >
                Reschedule
              </Button>
              {onCancelBooking && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCancelBooking(booking.id)}
                  className="text-xs text-[#b42318] hover:bg-red-50 hover:text-[#b42318]"
                >
                  Cancel
                </Button>
              )}
            </>
          )}

          {isCompleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReview}
              className="text-xs"
            >
              Leave Review
            </Button>
          )}

          {isCancelled && (
            <span className="text-xs text-[#66716d] italic">
              Cancelled (Hold released)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
