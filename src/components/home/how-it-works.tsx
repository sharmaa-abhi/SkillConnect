import React from 'react';
import { Search, UserCheck, CalendarCheck, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/layout/container';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Search & Compare',
      description: 'Search by issue, trade specialty, or postal code. Filter by verified licenses, rating, and same-day availability.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Inspect Credentials',
      description: 'Review verified state licenses, standard diagnostic rates, itemized pricing, and real homeowner reviews.',
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
    <section id="how-it-works" className="py-16 sm:py-20 bg-white border-b border-[#E4E7EC]">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D91]">
            Simple & Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#173B67] mt-1 tracking-tight">
            How SkillConnect Works
          </h2>
          <p className="text-sm text-[#667085] mt-2 leading-relaxed">
            Eliminating surprise pricing, unverified contractors, and predatory lead fees with a fair marketplace for homeowners and craftspeople.
          </p>
        </div>

        {/* 4 Steps Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative flex flex-col p-6 rounded-3xl bg-[#F7F8FA] border border-[#E4E7EC] hover:border-[#D0D5DD] transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-[#E4E7EC] text-[#173B67]">
                    Step {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-[#E6F7F5] text-[#0F9D91] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#263445] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#667085] leading-relaxed">
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
