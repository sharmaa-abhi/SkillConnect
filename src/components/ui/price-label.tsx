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
      <div className={`text-xs text-[#263445] ${className}`}>
        {diagnosticFee !== undefined && (
          <span className="font-bold text-[#173B67]">
            {formatCurrency(diagnosticFee)}{' '}
            <span className="font-normal text-[#667085]">diag</span>
          </span>
        )}
        {diagnosticFee !== undefined && hourlyRate !== undefined && (
          <span className="text-[#E4E7EC] mx-1.5">•</span>
        )}
        {hourlyRate !== undefined && (
          <span className="font-bold text-[#263445]">
            {formatCurrency(hourlyRate)}
            <span className="font-normal text-[#667085]">/hr</span>
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {hourlyRate !== undefined && (
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-[#173B67]">{formatCurrency(hourlyRate)}</span>
          <span className="text-xs text-[#667085] font-normal">/hr starting rate</span>
        </div>
      )}
      {diagnosticFee !== undefined && (
        <span className="text-xs text-[#667085] mt-0.5">
          {formatCurrency(diagnosticFee)} standard diagnostic inspection
        </span>
      )}
    </div>
  );
}
