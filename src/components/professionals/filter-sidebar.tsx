'use client';

import React from 'react';
import { FilterState } from '@/types';
import { serviceCategories } from '@/data/services';
import { RotateCcw, Star, Check, ShieldCheck, MapPin } from 'lucide-react';

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
    Boolean(filters.query) ||
    Boolean(filters.location);

  return (
    <aside className={`flex flex-col gap-6 p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-2xs ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
        <h3 className="font-bold text-base text-[#111827]">Filters</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-bold text-[#16A34A] hover:text-[#15803d] flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Location / ZIP Code */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-2">
          Service Location / ZIP
        </label>
        <div className="relative">
          <MapPin className="w-3.5 h-3.5 text-[#4B5563] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.location || ''}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="e.g. 94107 or SoMa"
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#111827]"
          />
        </div>
      </div>

      {/* Verified Only Toggle */}
      <div className="pt-4 border-t border-[#E5E7EB]">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <div>
              <span className="text-xs font-bold text-[#111827] block">Verified Only</span>
              <span className="text-[11px] text-[#4B5563]">Active state license on file</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={Boolean(filters.verifiedOnly)}
            onChange={(e) => onChange({ verifiedOnly: e.target.checked })}
            className="w-4 h-4 text-[#16A34A] rounded border-[#E5E7EB] focus:ring-[#16A34A] cursor-pointer"
          />
        </label>
      </div>

      {/* Available Today Toggle */}
      <div className="pt-4 border-t border-[#E5E7EB]">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <div>
            <span className="text-xs font-bold text-[#111827] block">Available Today</span>
            <span className="text-[11px] text-[#4B5563]">Urgent same-day dispatch</span>
          </div>
          <input
            type="checkbox"
            checked={filters.availableToday}
            onChange={(e) => onChange({ availableToday: e.target.checked })}
            className="w-4 h-4 text-[#16A34A] rounded border-[#E5E7EB] focus:ring-[#16A34A] cursor-pointer"
          />
        </label>
      </div>

      {/* Category Filter */}
      <div className="pt-4 border-t border-[#E5E7EB]">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-2.5">
          Trade Category
        </label>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onChange({ category: 'all' })}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
              filters.category === 'all'
                ? 'bg-blue-50 text-[#2563EB] font-bold'
                : 'text-[#111827] hover:bg-[#F8FAFC]'
            }`}
          >
            <span>All Categories</span>
            {filters.category === 'all' && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
          </button>
          {serviceCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange({ category: cat.slug })}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                filters.category === cat.slug
                  ? 'bg-blue-50 text-[#2563EB] font-bold'
                  : 'text-[#111827] hover:bg-[#F8FAFC]'
              }`}
            >
              <span>{cat.name}</span>
              {filters.category === cat.slug && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="pt-4 border-t border-[#E5E7EB]">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-2.5">
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
                  ? 'bg-blue-50 text-[#2563EB] font-bold'
                  : 'text-[#111827] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{item.label}</span>
              </div>
              {filters.minRating === item.val && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Tier */}
      <div className="pt-4 border-t border-[#E5E7EB]">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-2.5">
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
                  ? 'bg-[#0B0F0E] text-white border-[#0B0F0E]'
                  : 'bg-white border-[#E5E7EB] text-[#111827] hover:bg-[#F8FAFC]'
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
