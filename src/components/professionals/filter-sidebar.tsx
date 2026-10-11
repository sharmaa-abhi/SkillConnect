'use client';

import React from 'react';
import { FilterState } from '@/types';
import { serviceCategories } from '@/data/services';
import { RotateCcw, Star, Check, ShieldCheck } from 'lucide-react';

export interface FilterSidebarProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  className?: string;
}

export function FilterSidebar({
  filters,
  onChange,
  onReset,
  className = '',
}: FilterSidebarProps) {
  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.minRating !== null ||
    filters.availableToday ||
    Boolean(filters.verifiedOnly) ||
    filters.priceTier !== 'all' ||
    Boolean(filters.query);

  return (
    <aside className={`flex flex-col gap-6 p-6 rounded-3xl bg-white border border-[#E4E7EC] shadow-2xs ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC]">
        <h3 className="font-bold text-base text-[#173B67]">Filters</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-bold text-[#0F9D91] hover:text-[#0B7F75] flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Verified Only Toggle */}
      <div>
        <label className="flex items-center justify-between cursor-pointer select-none">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0F9D91]" />
            <div>
              <span className="text-xs font-bold text-[#263445] block">Verified Only</span>
              <span className="text-[11px] text-[#667085]">Active state license on file</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={Boolean(filters.verifiedOnly)}
            onChange={(e) => onChange({ verifiedOnly: e.target.checked })}
            className="w-4 h-4 text-[#0F9D91] rounded border-[#D0D5DD] focus:ring-[#0F9D91] cursor-pointer"
          />
        </label>
      </div>

      {/* Available Today Toggle */}
      <div className="pt-4 border-t border-[#E4E7EC]">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <div>
            <span className="text-xs font-bold text-[#263445] block">Available Today</span>
            <span className="text-[11px] text-[#667085]">Urgent same-day dispatch</span>
          </div>
          <input
            type="checkbox"
            checked={filters.availableToday}
            onChange={(e) => onChange({ availableToday: e.target.checked })}
            className="w-4 h-4 text-[#0F9D91] rounded border-[#D0D5DD] focus:ring-[#0F9D91] cursor-pointer"
          />
        </label>
      </div>

      {/* Category Filter */}
      <div className="pt-4 border-t border-[#E4E7EC]">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#667085] mb-2.5">
          Trade Category
        </label>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onChange({ category: 'all' })}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
              filters.category === 'all'
                ? 'bg-[#EBF1F8] text-[#173B67] font-bold'
                : 'text-[#263445] hover:bg-[#F7F8FA]'
            }`}
          >
            <span>All Categories</span>
            {filters.category === 'all' && <Check className="w-3.5 h-3.5 text-[#173B67]" />}
          </button>
          {serviceCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange({ category: cat.slug })}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                filters.category === cat.slug
                  ? 'bg-[#EBF1F8] text-[#173B67] font-bold'
                  : 'text-[#263445] hover:bg-[#F7F8FA]'
              }`}
            >
              <span>{cat.name}</span>
              {filters.category === cat.slug && <Check className="w-3.5 h-3.5 text-[#173B67]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="pt-4 border-t border-[#E4E7EC]">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#667085] mb-2.5">
          Minimum Rating
        </label>
        <div className="flex flex-col gap-1.5">
          {[
            { label: 'Any Rating', val: null },
            { label: '4.8+ Stars', val: 4.8 },
            { label: '4.5+ Stars', val: 4.5 },
            { label: '4.0+ Stars', val: 4.0 },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onChange({ minRating: item.val })}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                filters.minRating === item.val
                  ? 'bg-[#EBF1F8] text-[#173B67] font-bold'
                  : 'text-[#263445] hover:bg-[#F7F8FA]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-[#E7A83E] text-[#E7A83E]" />
                <span>{item.label}</span>
              </div>
              {filters.minRating === item.val && <Check className="w-3.5 h-3.5 text-[#173B67]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Tier */}
      <div className="pt-4 border-t border-[#E4E7EC]">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#667085] mb-2.5">
          Hourly Labor Tier
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: 'all', label: 'All' },
            { id: '$', label: '<$60' },
            { id: '$$', label: '$60-90' },
            { id: '$$$', label: '$90+' },
          ].map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => onChange({ priceTier: tier.id })}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                filters.priceTier === tier.id
                  ? 'bg-[#173B67] text-white border-[#173B67]'
                  : 'bg-white border-[#E4E7EC] text-[#263445] hover:bg-[#F7F8FA]'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
