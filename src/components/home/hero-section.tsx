'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, ShieldCheck, Star, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { serviceCategories } from '@/data/services';

export function HeroSection() {
  const router = useRouter();
  const [serviceQuery, setServiceQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (serviceQuery.trim()) params.set('query', serviceQuery.trim());
    if (locationQuery.trim()) params.set('location', locationQuery.trim());
    router.push(`/professionals?${params.toString()}`);
  };

  const handleChipClick = (catSlug: string) => {
    router.push(`/professionals?category=${catSlug}`);
  };

  return (
    <section className="relative pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-16 lg:pb-24 bg-gradient-to-b from-[#EBF1F8]/50 via-[#F7F8FA] to-[#F7F8FA] overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headlines, Search Form, Category Chips */}
          <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white border border-[#173B67]/20 shadow-2xs w-fit max-w-full">
              <ShieldCheck className="w-4 h-4 text-[#0F9D91] shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-[#173B67] leading-tight">
                <span className="hidden sm:inline">Verified State Licenses • Upfront Diagnostic Pricing • Escrow Protection</span>
                <span className="sm:hidden">Verified Licenses • Upfront Fees • Escrow</span>
              </span>
            </div>

            {/* Display H1 */}
            <h1 className="text-2xl sm:text-4xl lg:text-[46px] font-black text-[#173B67] tracking-tight leading-[1.12]">
              Find trusted help.{' '}
              <span className="text-[#0F9D91] block sm:inline">Book confidently.</span>
            </h1>

            {/* Body Large */}
            <p className="text-sm sm:text-base lg:text-lg text-[#667085] max-w-xl leading-relaxed">
              Connect with verified local trade professionals. Transparent diagnostic fees, guaranteed craftsmanship, and funds held safely in escrow until you sign off.
            </p>

            {/* Unified Search Pill Container */}
            <form
              onSubmit={handleSearch}
              className="bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl border border-[#D0D5DD] shadow-md hover:shadow-lg transition-all flex flex-col md:flex-row items-stretch md:items-center gap-2"
            >
              {/* Service Input */}
              <div className="flex-1 flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:px-3.5 sm:py-2.5">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F9D91] flex-shrink-0" />
                <div className="flex-1">
                  <label htmlFor="hero-service-search" className="sr-only">
                    What service do you need?
                  </label>
                  <input
                    id="hero-service-search"
                    type="text"
                    value={serviceQuery}
                    onChange={(e) => setServiceQuery(e.target.value)}
                    placeholder="What do you need help with? (e.g. leaky sink)"
                    className="w-full text-xs sm:text-sm text-[#263445] placeholder:text-[#667085]/70 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden md:block w-px h-8 bg-[#E4E7EC]" />

              {/* Location Input */}
              <div className="flex items-center gap-3 px-3.5 py-2.5 md:w-64 border-t md:border-t-0 border-[#E4E7EC]">
                <MapPin className="w-5 h-5 text-[#667085] flex-shrink-0" />
                <div className="flex-1">
                  <label htmlFor="hero-location-search" className="sr-only">
                    Neighborhood or Postal Code
                  </label>
                  <input
                    id="hero-location-search"
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="ZIP / District (e.g. 94107)"
                    className="w-full text-sm text-[#263445] placeholder:text-[#667085]/70 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full md:w-auto px-7 rounded-xl font-bold justify-center"
              >
                Search Pros
              </Button>
            </form>

            {/* Popular Category Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-[#667085] mr-1">
                Popular:
              </span>
              {serviceCategories.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleChipClick(cat.slug)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white hover:bg-[#EBF1F8] text-[#263445] hover:text-[#173B67] border border-[#E4E7EC] hover:border-[#173B67]/30 transition-all shadow-2xs"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Curated Professional Preview Card Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Card */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#E4E7EC] relative z-10">
                <div className="flex items-start gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                    alt="Elena Rodriguez"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#173B67] bg-[#EBF1F8] px-2.5 py-0.5 rounded-full">
                        Verified Pro
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#263445]">
                        <Star className="w-3.5 h-3.5 fill-[#E7A83E] text-[#E7A83E]" />
                        <span>4.98</span>
                        <span className="text-[#667085] font-normal">(189)</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-[#263445] mt-1">Elena Rodriguez</h3>
                    <p className="text-xs text-[#667085]">Licensed Electrical Specialist</p>
                  </div>
                </div>

                <div className="mt-4 p-3.5 rounded-2xl bg-[#F7F8FA] border border-[#E4E7EC] text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[#667085] block text-[11px] font-semibold">Diagnostic Fee</span>
                    <span className="font-extrabold text-[#173B67] text-sm">$75.00</span>
                  </div>
                  <div className="h-6 w-px bg-[#E4E7EC]" />
                  <div>
                    <span className="text-[#667085] block text-[11px] font-semibold">Hourly Labor</span>
                    <span className="font-bold text-[#263445] text-sm">$95.00/hr</span>
                  </div>
                  <div className="h-6 w-px bg-[#E4E7EC]" />
                  <div className="text-right">
                    <span className="text-[#15803D] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" />
                      Available Today
                    </span>
                    <span className="text-[10px] text-[#667085]">Mission • SoMa</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Link href="/professionals/elena-rodriguez" className="w-full">
                    <Button variant="primary" className="w-full justify-center">
                      View Profile & Rates
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Floating Pill: Instant Booking Confirmation */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white p-3.5 rounded-2xl shadow-lg border border-[#E4E7EC] z-20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E6F7F5] text-[#0F9D91] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#15803D] uppercase tracking-wider block">
                    Escrow Protected
                  </span>
                  <p className="text-xs font-bold text-[#173B67]">
                    Funds held safely until sign-off
                  </p>
                </div>
              </div>

              {/* Floating Pill: Fast Dispatch */}
              <div className="hidden sm:flex absolute -top-4 -right-4 bg-[#173B67] text-white p-3 rounded-2xl shadow-lg z-20 items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#0F9D91]" />
                <span className="text-xs font-bold">15-Min Response Average</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
