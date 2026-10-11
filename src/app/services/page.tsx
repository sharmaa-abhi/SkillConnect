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
  Calculator,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { serviceCategories, subServices } from '@/data/services';
import { formatCurrency } from '@/lib/formatters';
import { EmptyState } from '@/components/ui/empty-state';
import { AICostEstimator } from '@/components/pricing/ai-cost-estimator';

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
  const [showEstimator, setShowEstimator] = useState(false);

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
    <div className="py-10 sm:py-16 bg-[#F7F8FA]">
      <Container>
        {/* Header Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D91]">
            Local Trade Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#173B67] mt-1.5 tracking-tight">
            Browse Local Services
          </h1>
          <p className="text-sm sm:text-base text-[#667085] mt-2 leading-relaxed">
            Explore certified trade specialties, benchmark task timelines, and transparent diagnostic starting fees.
          </p>

          {/* Quick Search & AI Estimator Toggle */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center max-w-lg mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services (e.g. pipe, panel, cleaning)"
                className="w-full pl-10 pr-4 py-2.5 bg-white text-xs sm:text-sm rounded-xl border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-[#173B67] transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#667085] hover:text-[#263445] absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-gray-100"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowEstimator(!showEstimator)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#E6F7F5] hover:bg-[#D3EFEA] text-[#0F9D91] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Calculator className="w-4 h-4" />
              <span>{showEstimator ? 'Hide Estimator' : 'AI Cost Estimator'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Estimator Section */}
        {showEstimator && (
          <div className="mb-12">
            <AICostEstimator />
          </div>
        )}

        {/* Results Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat) => {
              const Icon = iconMap[cat.iconName] || Wrench;

              return (
                <div
                  key={cat.id}
                  className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border border-[#E4E7EC] hover:border-[#D0D5DD] shadow-2xs hover:shadow-md transition-all"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#E6F7F5] text-[#0F9D91] flex items-center justify-center shadow-2xs">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EBF1F8] text-[#173B67]">
                        {cat.professionalCount} Active Pros
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-[#173B67]">
                      {cat.name}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#667085] mt-2 leading-relaxed">
                      {cat.longDescription}
                    </p>

                    {/* Popular Tasks */}
                    <div className="mt-5">
                      <span className="text-[11px] font-bold text-[#263445] uppercase tracking-wider block mb-2">
                        Common Tasks Handled:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.popularTasks.map((task) => (
                          <span
                            key={task}
                            className="text-xs px-2.5 py-1 rounded-lg bg-[#F7F8FA] text-[#263445] border border-[#E4E7EC]"
                          >
                            {task}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Pricing & Link */}
                  <div className="mt-8 pt-4 border-t border-[#E4E7EC] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#667085] block font-semibold">Starting from</span>
                      <span className="font-extrabold text-base text-[#173B67]">
                        {formatCurrency(cat.startingPrice)}
                        <span className="text-xs font-normal text-[#667085]">
                          /{cat.priceUnit === 'diagnostic' ? 'diagnostic' : 'hr'}
                        </span>
                      </span>
                    </div>

                    <Link
                      href={`/professionals?category=${cat.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#173B67] hover:bg-[#0F2A4A] text-white text-xs font-bold shadow-2xs transition-colors"
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
        <div className="mt-12 sm:mt-16 p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[#E4E7EC] shadow-2xs">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#0F9D91] shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-[#173B67]">
              Standard Diagnostic Pricing & Scope Benchmark
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#667085] mb-5 max-w-2xl leading-relaxed">
            We require standard benchmark diagnostic estimates so you have full clarity on costs before work begins on your home.
          </p>

          {/* Desktop/Tablet Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#E4E7EC] text-[#667085] font-bold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 pr-4">Typical Task</th>
                  <th className="pb-3 px-4">Standard Scope Description</th>
                  <th className="pb-3 px-4">Estimated Labor</th>
                  <th className="pb-3 pl-4">Typical Cost Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC] text-[#263445]">
                {subServices.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#F7F8FA]/60">
                    <td className="py-3.5 pr-4 font-bold text-[#173B67]">{sub.name}</td>
                    <td className="py-3.5 px-4 text-[#667085] text-xs">{sub.description}</td>
                    <td className="py-3.5 px-4 text-[#667085]">{sub.estimatedLaborHours}</td>
                    <td className="py-3.5 pl-4 font-bold text-[#263445]">{sub.typicalCostRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (No Horizontal Table Scroll Needed) */}
          <div className="sm:hidden space-y-3">
            {subServices.map((sub) => (
              <div key={sub.id} className="p-3.5 rounded-xl border border-[#E4E7EC] bg-[#F7F8FA]/50 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-xs text-[#173B67] leading-snug">{sub.name}</h3>
                  <span className="font-bold text-xs text-[#263445] shrink-0">{sub.typicalCostRange}</span>
                </div>
                <p className="text-[11px] text-[#667085] leading-relaxed">{sub.description}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-[#667085] pt-1 border-t border-[#E4E7EC]">
                  <span className="font-medium">Estimated Labor:</span>
                  <span className="font-bold text-[#173B67]">{sub.estimatedLaborHours}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
