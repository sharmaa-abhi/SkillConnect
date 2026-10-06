import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { professionals } from '@/data/professionals';
import { ProfessionalCard } from '@/components/professionals/professional-card';

export function FeaturedPros() {
  const featured = professionals.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-[#f8f8f4] border-b border-[#e3e8e3]">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#237a63]">
              Top-Rated Local Specialists
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172522] mt-1 tracking-tight">
              Featured Verified Professionals
            </h2>
            <p className="text-sm text-[#66716d] mt-1 max-w-xl">
              Every professional is backed by verified trade credentials, active liability coverage, and real homeowner reviews.
            </p>
          </div>

          <Link
            href="/professionals"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#237a63] hover:text-[#143d35] group"
          >
            <span>Explore all {professionals.length} professionals</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {featured.map((pro) => (
            <ProfessionalCard key={pro.id} professional={pro} />
          ))}
        </div>
      </Container>
    </section>
  );
}
