import React from 'react';
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
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { serviceCategories } from '@/data/services';
import { formatCurrency } from '@/lib/formatters';

const iconMap: Record<string, React.ElementType> = {
  Wrench,
  Zap,
  Hammer,
  Sparkles,
  Paintbrush,
  ThermometerSnowflake,
  Cpu,
};

export function ServiceCategories() {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#e3e8e3]">
      <Container>
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#237a63]">
              Specialized Trades
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172522] mt-1 tracking-tight">
              Explore Popular Services
            </h2>
            <p className="text-sm text-[#66716d] mt-1.5 max-w-xl">
              From emergency leaks to structural woodworking, connect directly with vetted specialists in your neighborhood.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#237a63] hover:text-[#143d35] group"
          >
            <span>Browse all categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 7 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCategories.map((cat, idx) => {
            const Icon = iconMap[cat.iconName] || Wrench;
            const isFeatured = idx === 0 || idx === 1;

            return (
              <Link
                key={cat.id}
                href={`/professionals?category=${cat.slug}`}
                className={`group flex flex-col justify-between p-6 rounded-2xl border transition-all duration-200 ${
                  isFeatured
                    ? 'bg-[#f8f8f4] border-[#237a63]/30 hover:border-[#237a63] hover:shadow-md'
                    : 'bg-white border-[#e3e8e3] hover:border-[#c8d3cc] hover:shadow-md'
                }`}
              >
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#e7f4ed] text-[#237a63] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#143d35] group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-[#172522] group-hover:text-[#237a63] transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-[#66716d] mt-2 line-clamp-2 leading-relaxed">
                    {cat.shortDescription}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#e3e8e3] flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-[#66716d] block text-[11px]">Starting from</span>
                    <span className="font-bold text-[#143d35]">
                      {formatCurrency(cat.startingPrice)}
                      <span className="text-[10px] font-normal text-[#66716d]">
                        /{cat.priceUnit === 'diagnostic' ? 'diagnostic' : 'hr'}
                      </span>
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-[#237a63] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Find Pros</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
