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
      className={`p-5 rounded-2xl bg-white border border-[#e3e8e3] shadow-xs flex items-start justify-between ${className}`}
    >
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#66716d]">
          {label}
        </span>
        <div className="text-2xl font-bold text-[#172522] mt-1 tracking-tight">
          {value}
        </div>
        {(subtext || trend) && (
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            {trend && <span className="text-[#16794b] font-semibold">{trend}</span>}
            {subtext && <span className="text-[#66716d]">{subtext}</span>}
          </div>
        )}
      </div>

      {icon && (
        <div className="p-3 rounded-xl bg-[#e7f4ed] text-[#237a63] flex-shrink-0">
          {icon}
        </div>
      )}
    </div>
  );
}
