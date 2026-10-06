import React from 'react';
import { Search, UserCheck, CalendarCheck, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/layout/container';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Search & Filter',
      description: 'Search by issue, service trade, or postal code. Filter by verified licenses, rating, and same-day availability.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Compare Profiles',
      description: 'Inspect verified state licenses, standard diagnostic rates, itemized pricing, and real customer reviews.',
      icon: UserCheck,
    },
    {
      num: '03',
      title: 'Book Upfront Estimates',
      description: 'Select your preferred arrival slot. Standard diagnostic fees are credited 100% toward accepted repair labor.',
      icon: CalendarCheck,
    },
    {
      num: '04',
      title: 'Sign Off & Release',
      description: 'Your payment remains safely pre-authorized in escrow until you inspect completed work and sign off.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-white border-b border-[#e3e8e3]">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#237a63]">
            Simple & Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#172522] mt-1 tracking-tight">
            How SkillConnect Works
          </h2>
          <p className="text-sm text-[#66716d] mt-2 leading-relaxed">
            Eliminating surprise pricing, unverified contractors, and predatory lead fees with a fair marketplace for homeowners and craftspeople.
          </p>
        </div>

        {/* 4 Steps Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative flex flex-col p-6 rounded-2xl bg-[#f8f8f4] border border-[#e3e8e3] hover:border-[#c8d3cc] transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-white border border-[#e3e8e3] text-[#237a63]">
                    Step {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#e7f4ed] text-[#237a63] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#172522] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#66716d] leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
