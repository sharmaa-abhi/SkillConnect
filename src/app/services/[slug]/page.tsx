'use client';

import React, { use, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Zap,
  Hammer,
  Sparkles,
  Paintbrush,
  ThermometerSnowflake,
  Cpu,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Calculator,
  Users,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { serviceCategories, subServices } from '@/data/services';
import { professionals } from '@/data/professionals';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
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

export default function ServiceCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [showEstimator, setShowEstimator] = useState(false);

  const category = useMemo(
    () => serviceCategories.find((c) => c.slug === slug),
    [slug]
  );

  const categorySubServices = useMemo(
    () => (category ? subServices.filter((s) => s.categoryId === category.id) : []),
    [category]
  );

  const categoryPros = useMemo(
    () => (category ? professionals.filter((p) => p.categorySlug === category.slug) : []),
    [category]
  );

  if (!category) {
    return (
      <div className="py-20 bg-white">
        <Container size="narrow" className="text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <AlertCircle className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">
            Service Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B0F0E] mt-2">
            No service category matches &ldquo;{slug}&rdquo;
          </h1>
          <p className="text-sm text-[#6B7280] mt-3 leading-relaxed">
            This service category may not exist or may have been removed. Browse all available services below.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/services">
              <Button variant="primary" size="lg" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Browse All Services
              </Button>
            </Link>
            <Link href="/professionals">
              <Button variant="outline" size="lg">
                Find Professionals
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const Icon = iconMap[category.iconName] || Wrench;

  return (
    <div className="py-10 sm:py-16 bg-white">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#6B7280] mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#0B0F0E] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-[#0B0F0E] transition-colors">Services</Link>
          <span>/</span>
          <span className="text-[#0B0F0E] font-semibold">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B0F0E] tracking-tight">
                  {category.name}
                </h1>
                <p className="text-xs text-[#6B7280] mt-0.5">{category.shortDescription}</p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed max-w-2xl mt-4">
              {category.longDescription}
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-6">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-[#16A34A]" />
                <span className="font-bold text-[#0B0F0E]">{category.professionalCount}</span>
                <span className="text-[#6B7280]">Active Professionals</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-[#2563EB]" />
                <span className="text-[#6B7280]">Starting from</span>
                <span className="font-bold text-[#0B0F0E]">
                  {formatCurrency(category.startingPrice)}
                  /{category.priceUnit === 'diagnostic' ? 'diagnostic' : 'hr'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                <span className="text-[#6B7280]">Escrow Protected</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href={`/professionals?category=${category.slug}`}>
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Find {category.name} Pros
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Calculator className="w-4 h-4" />}
                onClick={() => setShowEstimator(!showEstimator)}
              >
                {showEstimator ? 'Hide Estimator' : 'Get Cost Estimate'}
              </Button>
            </div>
          </div>

          {/* Popular Tasks Card */}
          <div className="lg:w-80 shrink-0">
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB]">
              <h3 className="text-sm font-bold text-[#0B0F0E] uppercase tracking-wider mb-4">
                Common Tasks
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.popularTasks.map((task) => (
                  <span
                    key={task}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white text-[#0B0F0E] border border-[#E5E7EB] font-medium"
                  >
                    {task}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Cost Estimator (Collapsible) */}
        {showEstimator && (
          <div className="mb-12">
            <AICostEstimator />
          </div>
        )}

        {/* Sub-Services Pricing Table */}
        {categorySubServices.length > 0 && (
          <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB]">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold text-[#0B0F0E]">
                Diagnostic Pricing & Scope
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#6B7280] mb-5">
              Standard benchmark estimates for common {category.name.toLowerCase()} tasks. Final pricing confirmed after on-site diagnostic.
            </p>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-[#6B7280] font-bold uppercase tracking-wider text-[11px]">
                    <th className="pb-3 pr-4">Task</th>
                    <th className="pb-3 px-4">Description</th>
                    <th className="pb-3 px-4">Est. Labor</th>
                    <th className="pb-3 pl-4">Cost Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {categorySubServices.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/60">
                      <td className="py-3.5 pr-4 font-bold text-[#0B0F0E]">{sub.name}</td>
                      <td className="py-3.5 px-4 text-[#6B7280] text-xs">{sub.description}</td>
                      <td className="py-3.5 px-4 text-[#6B7280]">{sub.estimatedLaborHours}</td>
                      <td className="py-3.5 pl-4 font-bold text-[#0B0F0E]">{sub.typicalCostRange}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
              {categorySubServices.map((sub) => (
                <div key={sub.id} className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-xs text-[#0B0F0E]">{sub.name}</h3>
                    <span className="font-bold text-xs text-[#0B0F0E] shrink-0">{sub.typicalCostRange}</span>
                  </div>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed">{sub.description}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#6B7280] pt-1 border-t border-[#E5E7EB]">
                    <span className="font-medium">Labor:</span>
                    <span className="font-bold text-[#0B0F0E]">{sub.estimatedLaborHours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Professionals Preview */}
        {categoryPros.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0B0F0E]">
                  Top {category.name} Professionals
                </h2>
                <p className="text-xs text-[#6B7280] mt-1">
                  {categoryPros.length} verified specialists available in your area
                </p>
              </div>
              <Link
                href={`/professionals?category=${category.slug}`}
                className="text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryPros.slice(0, 3).map((pro) => (
                <Link
                  key={pro.id}
                  href={`/professionals/${pro.slug}`}
                  className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={pro.avatarUrl}
                      alt={pro.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#E5E7EB]"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-[#0B0F0E] group-hover:text-[#16A34A] transition-colors">
                        {pro.name}
                      </h3>
                      <p className="text-[11px] text-[#6B7280]">{pro.tradeTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6B7280]">
                      ★ {pro.rating} ({pro.reviewCount} reviews)
                    </span>
                    <span className="font-bold text-[#0B0F0E]">
                      {formatCurrency(pro.diagnosticFee)} diagnostic
                    </span>
                  </div>
                  {pro.availableToday && (
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#16A34A] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                      Available Today
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other Categories */}
        <div className="pt-8 border-t border-[#E5E7EB]">
          <h2 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider mb-4">
            Other Service Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {serviceCategories
              .filter((c) => c.slug !== slug)
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/services/${cat.slug}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] text-[#0B0F0E] hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:border-[#2563EB]/30 transition-all"
                >
                  {cat.name}
                </Link>
              ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
