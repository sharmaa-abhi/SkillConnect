import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, Clock } from 'lucide-react';

export type BadgeVariant = 'verified' | 'demo' | 'available' | 'neutral' | 'success' | 'warning';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'neutral', size = 'sm', className = '' }: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  const variantClasses = {
    verified: 'bg-[#e7f4ed] text-[#143d35] border border-[#237a63]/20 font-semibold',
    demo: 'bg-amber-50 text-amber-900 border border-amber-200 font-semibold',
    available: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium',
    neutral: 'bg-[#f8f8f4] text-[#66716d] border border-[#e3e8e3] font-medium',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200 font-medium',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full tracking-wide transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      {variant === 'verified' && <ShieldCheck className="w-3.5 h-3.5 text-[#237a63]" />}
      {variant === 'available' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />}
      {variant === 'demo' && <Sparkles className="w-3 h-3 text-amber-700" />}
      {children}
    </span>
  );
}

export function VerifiedProBadge({ tooltip = true }: { tooltip?: boolean }) {
  return (
    <span
      title={tooltip ? 'Sample profile verification indicator for prototype demonstration.' : undefined}
      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#143d35] bg-[#e7f4ed] px-2.5 py-0.5 rounded-full border border-[#237a63]/25"
    >
      <ShieldCheck className="w-3.5 h-3.5 text-[#237a63]" />
      <span>Verified Pro</span>
    </span>
  );
}
