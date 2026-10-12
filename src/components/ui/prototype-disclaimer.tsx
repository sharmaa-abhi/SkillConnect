'use client';

import React from 'react';
import { Info, ShieldAlert } from 'lucide-react';

export interface PrototypeDisclaimerProps {
  variant?: 'banner' | 'card' | 'inline';
  className?: string;
  customMessage?: string;
}

export const PROTOTYPE_DISCLAIMER_TITLE = 'Prototype — Simulated Data';
export const PROTOTYPE_DISCLAIMER_MESSAGE =
  'Some professional listings, estimates, dashboard metrics, and payment statuses may use simulated data. They do not represent verified live availability or actual financial transactions.';

export function PrototypeDisclaimer({
  variant = 'card',
  className = '',
  customMessage,
}: PrototypeDisclaimerProps) {
  const message = customMessage || PROTOTYPE_DISCLAIMER_MESSAGE;

  if (variant === 'banner') {
    return (
      <aside
        aria-label="Prototype Notice"
        role="status"
        className={`w-full bg-[#EBF1F8] border-b border-[#D0D5DD] py-2 px-4 sm:px-6 text-xs text-[#173B67] flex items-center justify-center gap-2 ${className}`}
      >
        <Info className="w-4 h-4 shrink-0 text-[#0F9D91]" />
        <span className="font-bold shrink-0">{PROTOTYPE_DISCLAIMER_TITLE}:</span>
        <span className="text-[#667085] truncate sm:whitespace-normal">{message}</span>
      </aside>
    );
  }

  if (variant === 'inline') {
    return (
      <div
        role="status"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EBF1F8] border border-[#D0D5DD] text-[11px] text-[#173B67] ${className}`}
      >
        <Info className="w-3.5 h-3.5 text-[#0F9D91] shrink-0" />
        <span className="font-bold">{PROTOTYPE_DISCLAIMER_TITLE}</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      className={`rounded-2xl bg-[#F7F8FA] border border-[#E4E7EC] p-3.5 sm:p-4 text-xs text-[#263445] flex items-start gap-3 shadow-2xs ${className}`}
    >
      <div className="w-7 h-7 rounded-xl bg-[#E6F7F5] text-[#0F9D91] flex items-center justify-center shrink-0 mt-0.5">
        <Info className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-[#173B67] text-xs sm:text-sm flex items-center gap-1.5">
          <span>{PROTOTYPE_DISCLAIMER_TITLE}</span>
        </h4>
        <p className="text-[#667085] text-[11px] sm:text-xs mt-0.5 leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}
