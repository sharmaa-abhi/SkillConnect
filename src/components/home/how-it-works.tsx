import React from 'react';
import Link from 'next/link';
import { Search, UserCheck, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Search by Issue or ZIP',
      subtitle: 'Instant trade matching & local coverage',
      description:
        'Tell us what is broken (e.g. "leaky sink", "circuit breaker", "AC not cooling"). Our smart search finds verified trade specialists licensed in your neighborhood.',
      icon: Search,
      highlight: 'Matches genuine local pros',
    },
    {
      num: '02',
      title: 'Compare Rates & Licenses',
      subtitle: 'Transparent diagnostic fees & hourly rates',
      description:
        'Review genuine state licenses (C-36, C-10, C-20), insurance status, and fixed diagnostic fees ($65–$95). The diagnostic fee is 100% credited toward accepted repair labor.',
      icon: UserCheck,
      highlight: '100% Diagnostic fee credited',
    },
    {
      num: '03',
      title: 'Sign Off & Release Escrow',
      subtitle: 'You hold the money until you are satisfied',
      description:
        'Your payment is pre-authorized and held safely in escrow. The technician is only paid after you inspect the finished repair and provide your digital sign-off.',
      icon: ShieldCheck,
      highlight: 'Zero risk, escrow-backed',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-[#E5E7EB]">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
            Simple &amp; Transparent Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B0F0E] mt-1 tracking-tight">
            How SkillConnect Works
          </h2>
          <p className="text-sm text-[#4B5563] mt-2 leading-relaxed">
            From emergency leaks to major installations, book trusted home repair specialists in three simple steps.
          </p>
        </div>

        {/* 3 Step Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E7EB] hover:border-[#16A34A]/40 hover:shadow-md transition-all shadow-2xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/15">
                      Step {step.num}
                    </span>
                    <div className="w-11 h-11 rounded-2xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#0B0F0E] mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#16A34A] mb-2.5">
                    {step.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#E5E7EB] flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#16A34A]/30">
                    {step.highlight}
                  </span>
                  <Link
                    href="/checkout"
                    className="text-xs font-bold text-[#0B0F0E] group-hover:text-[#16A34A] transition-colors flex items-center gap-1"
                  >
                    <span>Escrow details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Row */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/professionals">
            <Button variant="primary" size="lg" className="rounded-full px-7 font-bold shadow-xs">
              Find a Professional Now
            </Button>
          </Link>
          <Link href="/trust">
            <Button variant="outline" size="lg" className="rounded-full px-7 font-semibold">
              Read Our Trust &amp; Safety Charter
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
