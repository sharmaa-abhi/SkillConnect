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
    <section className="py-16 sm:py-20 bg-white border-b border-[#E5E7EB]">
      <Container>
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
              Specialized Trades
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B0F0E] mt-1 tracking-tight">
              Explore Popular Services
            </h2>
            <p className="text-sm text-[#4B5563] mt-1.5 max-w-xl">
              From emergency leaks to whole-home panel upgrades, connect directly with vetted specialists in your neighborhood.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B0F0E] hover:text-[#16A34A] group transition-colors"
          >
            <span>Browse all categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCategories.map((cat, idx) => {
            const Icon = iconMap[cat.iconName] || Wrench;
            const isFeatured = idx === 0 || idx === 1;

            return (
              <Link
                key={cat.id}
                href={`/services/${cat.slug}`}
                className={`group flex flex-col justify-between p-6 rounded-3xl border transition-all duration-200 ${
                  isFeatured
                    ? 'bg-[#F8FAFC] border-[#16A34A]/30 hover:border-[#16A34A] hover:shadow-md'
                    : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-md'
                }`}
              >
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#0B0F0E] group-hover:text-white transition-all shadow-2xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-[#0B0F0E] group-hover:text-[#16A34A] transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-[#4B5563] mt-2 line-clamp-2 leading-relaxed">
                    {cat.shortDescription}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-[#4B5563] block text-[11px] font-medium">Starting from</span>
                    <span className="font-extrabold text-[#0B0F0E]">
                      {formatCurrency(cat.startingPrice)}
                      <span className="text-[10px] font-normal text-[#4B5563]">
                        /{cat.priceUnit === 'diagnostic' ? 'diagnostic' : 'hr'}
                      </span>
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#16A34A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
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
