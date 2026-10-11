import React from 'react';

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
  trend,
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`p-5 rounded-2xl sm:rounded-3xl bg-white border border-[#E4E7EC] shadow-2xs flex items-start justify-between ${className}`}
    >
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
          {label}
        </span>
        <div className="text-2xl font-black text-[#173B67] mt-1 tracking-tight">
          {value}
        </div>
        {(subtext || trend) && (
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            {trend && <span className="text-[#15803D] font-bold">{trend}</span>}
            {subtext && <span className="text-[#667085]">{subtext}</span>}
          </div>
        )}
      </div>

      {icon && (
        <div className="p-3 rounded-2xl bg-[#E6F7F5] text-[#0F9D91] flex-shrink-0 shadow-2xs">
          {icon}
        </div>
      )}
    </div>
  );
}
