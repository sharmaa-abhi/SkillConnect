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
    <section className="py-16 sm:py-20 bg-white border-b border-[#E4E7EC]">
      <Container>
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D91]">
              Specialized Trades
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#173B67] mt-1 tracking-tight">
              Explore Popular Services
            </h2>
            <p className="text-sm text-[#667085] mt-1.5 max-w-xl">
              From emergency leaks to whole-home panel upgrades, connect directly with vetted specialists in your neighborhood.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#173B67] hover:text-[#0F9D91] group transition-colors"
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
                href={`/professionals?category=${cat.slug}`}
                className={`group flex flex-col justify-between p-6 rounded-3xl border transition-all duration-200 ${
                  isFeatured
                    ? 'bg-[#F7F8FA] border-[#173B67]/20 hover:border-[#173B67] hover:shadow-md'
                    : 'bg-white border-[#E4E7EC] hover:border-[#D0D5DD] hover:shadow-md'
                }`}
              >
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-[#E6F7F5] text-[#0F9D91] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#173B67] group-hover:text-white transition-all shadow-2xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-[#263445] group-hover:text-[#173B67] transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-[#667085] mt-2 line-clamp-2 leading-relaxed">
                    {cat.shortDescription}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E4E7EC] flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-[#667085] block text-[11px] font-medium">Starting from</span>
                    <span className="font-extrabold text-[#173B67]">
                      {formatCurrency(cat.startingPrice)}
                      <span className="text-[10px] font-normal text-[#667085]">
                        /{cat.priceUnit === 'diagnostic' ? 'diagnostic' : 'hr'}
                      </span>
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#0F9D91] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
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
