'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { useProfessionalsList } from '@/lib/demo-storage';
import { ProfessionalCard } from '@/components/professionals/professional-card';
import { Professional } from '@/types/professional';

export function FeaturedPros() {
  const pros = useProfessionalsList();
  const featured = pros.filter((p: Professional) => p.featured).slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-[#F7F8FA] border-b border-[#E4E7EC]">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D91]">
              Top-Rated Local Specialists
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#173B67] mt-1 tracking-tight">
              Featured Verified Professionals
            </h2>
            <p className="text-sm text-[#667085] mt-1 max-w-xl">
              Every professional is backed by verified trade credentials, active liability coverage, and real homeowner reviews.
            </p>
          </div>

          <Link
            href="/professionals"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#173B67] hover:text-[#0F9D91] group transition-colors"
          >
            <span>Explore all {pros.length} professionals</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {featured.map((pro: Professional) => (
            <ProfessionalCard key={pro.id} professional={pro} />
          ))}
        </div>
      </Container>
    </section>
  );
}
