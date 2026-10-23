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
    verified: 'bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20 font-semibold',
    demo: 'bg-[#F8FAFC] text-[#0B0F0E] border border-[#E5E7EB] font-semibold',
    available: 'bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/30 font-semibold',
    neutral: 'bg-[#F8FAFC] text-[#4B5563] border border-[#E5E7EB] font-medium',
    success: 'bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/30 font-semibold',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold',
    error: 'bg-red-50 text-[#DC2626] border border-red-200 font-semibold',
    pending: 'bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/30 font-semibold',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full tracking-wide transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      {variant === 'verified' && <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />}
      {variant === 'available' && <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />}
      {variant === 'demo' && <Sparkles className="w-3 h-3 text-[#2563EB]" />}
      {children}
    </span>
  );
}

export function VerifiedProBadge({ tooltip = true }: { tooltip?: boolean }) {
  return (
    <span
      title={tooltip ? 'Licensed & insured verified service professional' : undefined}
      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#16A34A]/30 shadow-2xs"
    >
      <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
      <span>Verified Pro</span>
    </span>
  );
}

export function VerificationStatusBadge({ status }: { status: VerificationStatusType }) {
  switch (status) {
    case 'verified':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#16A34A]/30">
          <CheckCircle2 className="w-3 h-3" />
          <span>Verified Active</span>
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          <Clock className="w-3 h-3" />
          <span>Pending Review</span>
        </span>
      );
    case 'submitted':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#2563EB]/25">
          <Clock className="w-3 h-3" />
          <span>Submitted</span>
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
          <XCircle className="w-3 h-3" />
          <span>Rejected</span>
        </span>
      );
    case 'expired':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4B5563] bg-gray-100 px-2.5 py-0.5 rounded-full border border-[#E5E7EB]">
          <AlertTriangle className="w-3 h-3" />
          <span>Expired</span>
        </span>
      );
    default:
      return null;
  }
}
