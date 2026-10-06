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
    <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-[#e7f4ed]/50 via-[#f8f8f4] to-[#f8f8f4] overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines, Search Form, Category Chips */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#237a63]/25 shadow-xs w-fit">
              <ShieldCheck className="w-4 h-4 text-[#237a63]" />
              <span className="text-xs font-semibold text-[#143d35]">
                Verified Trade Licenses • Transparent Diagnostic Pricing
              </span>
            </div>

            {/* Display H1 */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#172522] tracking-tight leading-[1.15]">
              Find trusted help.{' '}
              <span className="text-[#237a63] block sm:inline">Book confidently.</span>
            </h1>

            {/* Body Large */}
            <p className="text-base sm:text-lg text-[#66716d] max-w-xl leading-relaxed">
              Connect with licensed local plumbers, electricians, carpenters, and repair specialists. Upfront pricing, verified reviews, and guaranteed craftsmanship.
            </p>

            {/* Unified Search Pill Container */}
            <form
              onSubmit={handleSearch}
              className="bg-white p-2 rounded-2xl border border-[#c8d3cc] shadow-md hover:shadow-lg transition-all flex flex-col md:flex-row items-stretch md:items-center gap-2"
            >
              {/* Service Input */}
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5">
                <Search className="w-5 h-5 text-[#237a63] flex-shrink-0" />
                <div className="flex-1">
                  <label htmlFor="hero-service-search" className="sr-only">
                    What service do you need?
                  </label>
                  <input
                    id="hero-service-search"
                    type="text"
                    value={serviceQuery}
                    onChange={(e) => setServiceQuery(e.target.value)}
                    placeholder="What do you need help with? (e.g. leaky sink, wiring)"
                    className="w-full text-sm text-[#172522] placeholder:text-[#66716d]/70 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden md:block w-px h-8 bg-[#e3e8e3]" />

              {/* Location Input */}
              <div className="flex items-center gap-3 px-3.5 py-2.5 md:w-64 border-t md:border-t-0 border-[#e3e8e3]">
                <MapPin className="w-5 h-5 text-[#66716d] flex-shrink-0" />
                <div className="flex-1">
                  <label htmlFor="hero-location-search" className="sr-only">
                    Neighborhood or Postal Code
                  </label>
                  <input
                    id="hero-location-search"
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Neighborhood (e.g. 94107)"
                    className="w-full text-sm text-[#172522] placeholder:text-[#66716d]/70 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full md:w-auto px-6 rounded-xl font-semibold justify-center"
              >
                Search
              </Button>
            </form>

            {/* Popular Category Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-[#66716d] mr-1">
                Popular:
              </span>
              {serviceCategories.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleChipClick(cat.slug)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-white hover:bg-[#e7f4ed] text-[#172522] hover:text-[#143d35] border border-[#e3e8e3] hover:border-[#237a63]/30 transition-all shadow-2xs"
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
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#e3e8e3] relative z-10">
                <div className="flex items-start gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                    alt="Elena Vance"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#237a63] bg-[#e7f4ed] px-2.5 py-0.5 rounded-full">
                        Verified Pro
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#965b00]">
                        <Star className="w-3.5 h-3.5 fill-[#e5a33d] text-[#e5a33d]" />
                        <span>4.98</span>
                        <span className="text-[#66716d] font-normal">(189)</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-[#172522] mt-1">Elena Rodriguez</h3>
                    <p className="text-xs text-[#66716d]">Licensed Electrical Specialist</p>
                  </div>
                </div>

                <div className="mt-4 p-3.5 rounded-xl bg-[#f8f8f4] border border-[#e3e8e3] text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[#66716d] block text-[11px]">Diagnostic Fee</span>
                    <span className="font-bold text-[#143d35] text-sm">$75.00</span>
                  </div>
                  <div className="h-6 w-px bg-[#e3e8e3]" />
                  <div>
                    <span className="text-[#66716d] block text-[11px]">Hourly Labor</span>
                    <span className="font-bold text-[#172522] text-sm">$95.00/hr</span>
                  </div>
                  <div className="h-6 w-px bg-[#e3e8e3]" />
                  <div className="text-right">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Available Today
                    </span>
                    <span className="text-[10px] text-[#66716d]">Mission • SoMa</span>
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
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white p-3.5 rounded-2xl shadow-lg border border-[#e3e8e3] z-20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e7f4ed] text-[#237a63] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#16794b] uppercase tracking-wider block">
                    Escrow Protected
                  </span>
                  <p className="text-xs font-bold text-[#172522]">
                    Funds held until sign-off
                  </p>
                </div>
              </div>

              {/* Floating Pill: Fast Dispatch */}
              <div className="hidden sm:flex absolute -top-4 -right-4 bg-[#143d35] text-white p-3 rounded-2xl shadow-lg z-20 items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#e7f4ed]" />
                <span className="text-xs font-semibold">15-Min Avg Response</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
