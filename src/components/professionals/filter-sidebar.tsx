'use client';

import React from 'react';
import { FilterState } from '@/types';
import { serviceCategories } from '@/data/services';
import { RotateCcw, Star, DollarSign, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    filters.priceTier !== 'all' ||
    Boolean(filters.query);

  return (
    <aside className={`flex flex-col gap-6 p-5 rounded-2xl bg-white border border-[#e3e8e3] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e3e8e3]">
        <h3 className="font-bold text-base text-[#172522]">Filters</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-[#237a63] hover:text-[#143d35] flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#66716d] mb-2.5">
          Trade Category
        </label>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onChange({ category: 'all' })}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
              filters.category === 'all'
                ? 'bg-[#e7f4ed] text-[#143d35] font-semibold'
                : 'text-[#172522] hover:bg-[#f8f8f4]'
            }`}
          >
            <span>All Categories</span>
            {filters.category === 'all' && <Check className="w-3.5 h-3.5 text-[#237a63]" />}
          </button>
          {serviceCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange({ category: cat.slug })}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                filters.category === cat.slug
                  ? 'bg-[#e7f4ed] text-[#143d35] font-semibold'
                  : 'text-[#172522] hover:bg-[#f8f8f4]'
              }`}
            >
              <span>{cat.name}</span>
              {filters.category === cat.slug && <Check className="w-3.5 h-3.5 text-[#237a63]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Available Today Toggle */}
      <div className="pt-4 border-t border-[#e3e8e3]">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <div>
            <span className="text-xs font-semibold text-[#172522] block">Available Today</span>
            <span className="text-[11px] text-[#66716d]">Only ready for instant booking</span>
          </div>
          <input
            type="checkbox"
            checked={filters.availableToday}
            onChange={(e) => onChange({ availableToday: e.target.checked })}
            className="w-4 h-4 text-[#237a63] rounded border-[#c8d3cc] focus:ring-[#237a63] cursor-pointer"
          />
        </label>
      </div>

      {/* Minimum Rating */}
      <div className="pt-4 border-t border-[#e3e8e3]">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#66716d] mb-2.5">
          Minimum Rating
        </label>
        <div className="flex flex-col gap-1.5">
          {[
            { label: 'Any Rating', val: null },
            { label: '4.5+ Stars', val: 4.5 },
            { label: '4.0+ Stars', val: 4.0 },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onChange({ minRating: item.val })}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                filters.minRating === item.val
                  ? 'bg-[#e7f4ed] text-[#143d35] font-semibold'
                  : 'text-[#172522] hover:bg-[#f8f8f4]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-[#e5a33d] text-[#e5a33d]" />
                <span>{item.label}</span>
              </div>
              {filters.minRating === item.val && <Check className="w-3.5 h-3.5 text-[#237a63]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Tier */}
      <div className="pt-4 border-t border-[#e3e8e3]">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#66716d] mb-2.5">
          Hourly Rate Tier
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
              className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                filters.priceTier === tier.id
                  ? 'bg-[#143d35] text-white border-[#143d35]'
                  : 'bg-white border-[#e3e8e3] text-[#172522] hover:bg-[#f8f8f4]'
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
