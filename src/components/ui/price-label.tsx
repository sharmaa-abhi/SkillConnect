import React from 'react';
import { formatCurrency } from '@/lib/formatters';

export interface PriceLabelProps {
  diagnosticFee?: number;
  hourlyRate?: number;
  compact?: boolean;
  className?: string;
}

export function PriceLabel({
  diagnosticFee,
  hourlyRate,
  compact = false,
  className = '',
}: PriceLabelProps) {
  if (compact) {
    return (
      <div className={`text-xs text-[#111827] ${className}`}>
        {diagnosticFee !== undefined && (
          <span className="font-bold text-[#0B0F0E]">
            {formatCurrency(diagnosticFee)}{' '}
            <span className="font-normal text-[#4B5563]">diag</span>
          </span>
        )}
        {diagnosticFee !== undefined && hourlyRate !== undefined && (
          <span className="text-[#E5E7EB] mx-1.5">•</span>
        )}
        {hourlyRate !== undefined && (
          <span className="font-bold text-[#111827]">
            {formatCurrency(hourlyRate)}
            <span className="font-normal text-[#4B5563]">/hr</span>
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {hourlyRate !== undefined && (
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-[#0B0F0E]">{formatCurrency(hourlyRate)}</span>
          <span className="text-xs text-[#4B5563] font-normal">/hr starting rate</span>
        </div>
      )}
      {diagnosticFee !== undefined && (
        <span className="text-xs text-[#4B5563] mt-0.5">
          {formatCurrency(diagnosticFee)} standard diagnostic inspection
        </span>
      )}
    </div>
  );
}
