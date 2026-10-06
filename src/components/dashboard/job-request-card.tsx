'use client';

import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle } from 'lucide-react';
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
      message: `You accepted ${request.customerName}’s request. (Demo UI state)`,
    });
  };

  const handleDecline = () => {
    onStatusChange(request.id, 'declined');
    showToast({
      type: 'info',
      title: 'Job Request Declined',
      message: `Request #${request.id} was declined and returned to dispatch. (Demo UI state)`,
    });
  };

  const isPending = request.status === 'pending';
  const isAccepted = request.status === 'accepted';
  const isDeclined = request.status === 'declined';

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#e3e8e3] hover:border-[#c8d3cc] shadow-xs transition-all flex flex-col justify-between gap-4">
      <div>
        {/* Top Badges & Timing */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#66716d]">#{request.id}</span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#e7f4ed] text-[#143d35]">
              {request.serviceCategory}
            </span>
          </div>
          <span className="text-xs text-[#66716d]">{request.receivedAt}</span>
        </div>

        {/* Customer & Issue */}
        <h4 className="text-base font-bold text-[#172522]">
          {request.customerName}
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-[#66716d] mt-0.5 mb-3">
          <MapPin className="w-3.5 h-3.5 text-[#237a63]" />
          <span>{request.customerNeighborhood}</span>
        </div>

        <p className="text-sm text-[#172522] bg-[#f8f8f4] p-3 rounded-xl border border-[#e3e8e3]/80 leading-relaxed mb-4">
          &ldquo;{request.issueDescription}&rdquo;
        </p>

        {/* Schedule & Estimate */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#143d35] font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#237a63]" />
            <span>{request.requestedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-[#143d35] font-medium">
            <Clock className="w-3.5 h-3.5 text-[#237a63]" />
            <span>{request.requestedSlot}</span>
          </div>
        </div>
      </div>

      {/* Footer Status & Actions */}
      <div className="pt-4 border-t border-[#e3e8e3] flex items-center justify-between">
        <div>
          <span className="text-[11px] text-[#66716d] block">Est. Revenue</span>
          <span className="text-base font-bold text-[#143d35]">
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
                className="text-xs text-[#66716d] hover:text-[#b42318]"
              >
                Decline
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAccept}
                className="text-xs"
              >
                Accept Request
              </Button>
            </>
          )}

          {isAccepted && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#16794b] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmed</span>
            </span>
          )}

          {isDeclined && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#66716d] bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
              <XCircle className="w-3.5 h-3.5" />
              <span>Declined</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
