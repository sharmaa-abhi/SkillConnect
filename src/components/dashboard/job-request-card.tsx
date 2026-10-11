'use client';

import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, Phone } from 'lucide-react';
import { JobRequest } from '@/types/booking';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/toast-context';

export interface JobRequestCardProps {
  request: JobRequest;
  onStatusChange: (id: string, newStatus: 'accepted' | 'declined') => void;
}

export function JobRequestCard({ request, onStatusChange }: JobRequestCardProps) {
  const { showToast } = useToast();

  const handleAccept = () => {
    onStatusChange(request.id, 'accepted');
    showToast({
      type: 'success',
      title: 'Job Request Accepted',
      message: `You accepted ${request.customerName}’s appointment. Dispatch slot confirmed.`,
    });
  };

  const handleDecline = () => {
    onStatusChange(request.id, 'declined');
    showToast({
      type: 'info',
      title: 'Job Request Declined',
      message: `Request #${request.id} was declined and returned to dispatch pool.`,
    });
  };

  const isPending = request.status === 'pending';
  const isAccepted = request.status === 'accepted';
  const isDeclined = request.status === 'declined';

  return (
    <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#E4E7EC] hover:border-[#D0D5DD] shadow-2xs transition-all flex flex-col justify-between gap-4">
      <div>
        {/* Top Badges & Timing */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#173B67]">#{request.id}</span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF1F8] text-[#173B67]">
              {request.serviceCategory}
            </span>
          </div>
          <span className="text-xs text-[#667085]">{request.receivedAt}</span>
        </div>

        {/* Customer & Issue */}
        <h4 className="text-base font-bold text-[#263445]">
          {request.customerName}
        </h4>
        <div className="flex items-center gap-3 text-xs text-[#667085] mt-0.5 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#0F9D91]" />
            <span>{request.customerNeighborhood}</span>
          </div>
          {request.customerPhone && (
            <div className="flex items-center gap-1 text-[#173B67]">
              <Phone className="w-3 h-3 text-[#0F9D91]" />
              <span>{request.customerPhone}</span>
            </div>
          )}
        </div>

        <p className="text-xs sm:text-sm text-[#263445] bg-[#F7F8FA] p-3 rounded-xl border border-[#E4E7EC] leading-relaxed mb-4">
          &ldquo;{request.issueDescription}&rdquo;
        </p>

        {/* Schedule & Estimate */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[#173B67] font-semibold">
            <Calendar className="w-3.5 h-3.5 text-[#0F9D91]" />
            <span>{request.requestedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#173B67] font-semibold">
            <Clock className="w-3.5 h-3.5 text-[#0F9D91]" />
            <span>{request.requestedSlot}</span>
          </div>
        </div>
      </div>

      {/* Footer Status & Actions */}
      <div className="pt-4 border-t border-[#E4E7EC] flex items-center justify-between">
        <div>
          <span className="text-[10px] text-[#667085] uppercase tracking-wider block font-bold">Est. Revenue</span>
          <span className="text-base font-extrabold text-[#173B67]">
            {request.estimatedRevenue}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isPending && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDecline}
                className="text-xs text-[#667085] hover:text-[#B42318]"
              >
                Decline
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAccept}
                className="text-xs"
              >
                Accept Job
              </Button>
            </>
          )}

          {isAccepted && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmed Dispatch</span>
            </span>
          )}

          {isDeclined && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#667085] bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
              <XCircle className="w-3.5 h-3.5" />
              <span>Declined</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
