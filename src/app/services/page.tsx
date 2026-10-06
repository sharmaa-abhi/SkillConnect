'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Zap,
  Hammer,
  Sparkles,
  Paintbrush,
  ThermometerSnowflake,
  Cpu,
  Search,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { serviceCategories, subServices } from '@/data/services';
import { formatCurrency } from '@/lib/formatters';
import { EmptyState } from '@/components/ui/empty-state';

const iconMap: Record<string, React.ElementType> = {
  Wrench,
  Zap,
  Hammer,
  Sparkles,
  Paintbrush,
  ThermometerSnowflake,
  Cpu,
};

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return serviceCategories;
    const q = searchQuery.toLowerCase().trim();
    return serviceCategories.filter((cat) => {
      const matchName = cat.name.toLowerCase().includes(q);
      const matchDesc = cat.shortDescription.toLowerCase().includes(q) || cat.longDescription.toLowerCase().includes(q);
      const matchTasks = cat.popularTasks.some((t) => t.toLowerCase().includes(q));
      return matchName || matchDesc || matchTasks;
    });
  }, [searchQuery]);

  return (
    <div className="py-10 sm:py-16 bg-[#f8f8f4]">
      <Container>
        {/* Header Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#237a63]">
            Trade Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172522] mt-1.5 tracking-tight">
            Browse Local Services
          </h1>
          <p className="text-sm sm:text-base text-[#66716d] mt-2 leading-relaxed">
            Explore certified trade specialties, typical task timelines, and transparent diagnostic starting fees.
          </p>

          {/* Quick Search */}
          <div className="mt-6 relative max-w-md mx-auto">
            <Search className="w-5 h-5 text-[#66716d] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services (e.g. pipe, panel, cleaning)"
              className="w-full pl-10 pr-4 py-2.5 bg-white text-sm rounded-xl border border-[#c8d3cc] focus:outline-none focus:ring-2 focus:ring-[#237a63] transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#66716d] hover:text-[#172522] absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-gray-100"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat) => {
              const Icon = iconMap[cat.iconName] || Wrench;

              return (
                <div
                  key={cat.id}
                  className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-[#e3e8e3] hover:border-[#c8d3cc] shadow-xs hover:shadow-md transition-all"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#e7f4ed] text-[#237a63] flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f8f8f4] text-[#66716d] border border-[#e3e8e3]">
                        {cat.professionalCount} Active Pros
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-[#172522]">
                      {cat.name}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#66716d] mt-2 leading-relaxed">
                      {cat.longDescription}
                    </p>

                    {/* Popular Tasks */}
                    <div className="mt-5">
                      <span className="text-[11px] font-bold text-[#172522] uppercase tracking-wider block mb-2">
                        Common Tasks Handled:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.popularTasks.map((task) => (
                          <span
                            key={task}
                            className="text-xs px-2.5 py-1 rounded-lg bg-[#f8f8f4] text-[#172522] border border-[#e3e8e3]"
                          >
                            {task}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Pricing & Link */}
                  <div className="mt-8 pt-4 border-t border-[#e3e8e3] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#66716d] block">Starting from</span>
                      <span className="font-bold text-base text-[#143d35]">
                        {formatCurrency(cat.startingPrice)}
                        <span className="text-xs font-normal text-[#66716d]">
                          /{cat.priceUnit === 'diagnostic' ? 'diagnostic' : 'hr'}
                        </span>
                      </span>
                    </div>

                    <Link
                      href={`/professionals?category=${cat.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#237a63] hover:bg-[#1b6250] text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <span>Find {cat.name} Pros</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No service categories found"
            description={`We could not find any services matching "${searchQuery}".`}
            query={searchQuery}
            onReset={() => setSearchQuery('')}
            actionText="Clear Service Search"
          />
        )}

        {/* Sub-Services Diagnostic Pricing Guide */}
        <div className="mt-16 p-8 rounded-3xl bg-white border border-[#e3e8e3]">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-6 h-6 text-[#237a63]" />
            <h2 className="text-xl font-bold text-[#172522]">
              Standard Diagnostic Pricing & Scope Benchmark
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#66716d] mb-6 max-w-2xl">
            We require standard benchmark diagnostic estimates so you have full clarity on costs before work begins on your home.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#e3e8e3] text-[#66716d] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 pr-4">Typical Task</th>
                  <th className="pb-3 px-4">Standard Scope Description</th>
                  <th className="pb-3 px-4">Estimated Labor</th>
                  <th className="pb-3 pl-4">Typical Cost Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8e3] text-[#172522]">
                {subServices.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#f8f8f4]/60">
                    <td className="py-3.5 pr-4 font-semibold">{sub.name}</td>
                    <td className="py-3.5 px-4 text-[#66716d] text-xs">{sub.description}</td>
                    <td className="py-3.5 px-4 text-[#66716d]">{sub.estimatedLaborHours}</td>
                    <td className="py-3.5 pl-4 font-bold text-[#143d35]">{sub.typicalCostRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </div>
  );
}
