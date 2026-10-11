import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { VerificationStatusType } from '@/types/professional';

export type BadgeVariant =
  | 'verified'
  | 'demo'
  | 'available'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'pending';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'neutral', size = 'sm', className = '' }: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  const variantClasses = {
    verified: 'bg-[#EBF1F8] text-[#173B67] border border-[#173B67]/20 font-semibold',
    demo: 'bg-[#F7F8FA] text-[#173B67] border border-[#D0D5DD] font-semibold',
    available: 'bg-emerald-50 text-[#15803D] border border-emerald-200 font-medium',
    neutral: 'bg-[#F7F8FA] text-[#667085] border border-[#E4E7EC] font-medium',
    success: 'bg-emerald-50 text-[#15803D] border border-emerald-200 font-medium',
    warning: 'bg-amber-50 text-[#B54708] border border-amber-200 font-medium',
    error: 'bg-red-50 text-[#B42318] border border-red-200 font-medium',
    pending: 'bg-blue-50 text-[#173B67] border border-blue-200 font-medium',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full tracking-wide transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      {variant === 'verified' && <ShieldCheck className="w-3.5 h-3.5 text-[#173B67]" />}
      {variant === 'available' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />}
      {variant === 'demo' && <Sparkles className="w-3 h-3 text-[#173B67]" />}
      {children}
    </span>
  );
}

export function VerifiedProBadge({ tooltip = true }: { tooltip?: boolean }) {
  return (
    <span
      title={tooltip ? 'Licensed & insured verified service professional' : undefined}
      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#173B67] bg-[#EBF1F8] px-2.5 py-0.5 rounded-full border border-[#173B67]/20 shadow-2xs"
    >
      <ShieldCheck className="w-3.5 h-3.5 text-[#0F9D91]" />
      <span>Verified Pro</span>
    </span>
  );
}

export function VerificationStatusBadge({ status }: { status: VerificationStatusType }) {
  switch (status) {
    case 'verified':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#15803D] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          <span>Verified Active</span>
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B54708] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          <Clock className="w-3 h-3" />
          <span>Pending Review</span>
        </span>
      );
    case 'submitted':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#173B67] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
          <Clock className="w-3 h-3" />
          <span>Submitted</span>
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B42318] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
          <XCircle className="w-3 h-3" />
          <span>Rejected</span>
        </span>
      );
    case 'expired':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#667085] bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-300">
          <AlertTriangle className="w-3 h-3" />
          <span>Expired</span>
        </span>
      );
    default:
      return null;
  }
}
