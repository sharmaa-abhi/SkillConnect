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
      <div className={`text-xs text-[#172522] ${className}`}>
        {diagnosticFee !== undefined && (
          <span className="font-semibold text-[#143d35]">
            {formatCurrency(diagnosticFee)}{' '}
            <span className="font-normal text-[#66716d]">diagnostic</span>
          </span>
        )}
        {diagnosticFee !== undefined && hourlyRate !== undefined && (
          <span className="text-[#c8d3cc] mx-1.5">•</span>
        )}
        {hourlyRate !== undefined && (
          <span className="font-semibold text-[#172522]">
            {formatCurrency(hourlyRate)}
            <span className="font-normal text-[#66716d]">/hr</span>
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {hourlyRate !== undefined && (
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-[#143d35]">{formatCurrency(hourlyRate)}</span>
          <span className="text-xs text-[#66716d] font-normal">/hr starting rate</span>
        </div>
      )}
      {diagnosticFee !== undefined && (
        <span className="text-xs text-[#66716d] mt-0.5">
          {formatCurrency(diagnosticFee)} standard diagnostic inspection
        </span>
      )}
    </div>
  );
}
