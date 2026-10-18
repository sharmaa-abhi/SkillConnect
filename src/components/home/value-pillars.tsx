import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Scale, Lock, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Container } from '@/components/layout/container';

export function ValuePillars() {
  const pillars = [
    {
      step: '01',
      badge: 'Verified State Credentials',
      title: 'Licensed & Vetted Pros Only',
      tagline: 'No unverified handymen or ghost contractors',
      description:
        'Every professional must hold an active state trade license (C-36 Plumbing, C-10 Electrical, C-20 HVAC), verified commercial liability insurance, and biometric identity clearance before listing.',
      icon: ShieldCheck,
      features: [
        'Municipal license board verification',
        '$2,000,000 liability insurance minimum',
        'Direct ratings from verified bookings only',
      ],
      linkText: 'Learn about our verification standards',
      linkHref: '/trust',
    },
    {
      step: '02',
      badge: 'Transparent Pricing Engine',
      title: 'Upfront Quotes & AI Estimates',
      tagline: 'No surprise bills or awkward on-site haggling',
      description:
        'See fixed diagnostic fees and hourly labor rates before you book. Use our AI Cost Estimator to check fair market repair costs. Plus, 100% of your diagnostic fee is credited directly toward accepted repair labor.',
      icon: Scale,
      features: [
        'Instant AI fair-market cost benchmarks',
        '100% diagnostic fee credited to repair labor',
        'Itemized parts & labor breakdowns',
      ],
      linkText: 'Try the AI Cost Estimator',
      linkHref: '#estimator',
    },
    {
      step: '03',
      badge: 'Financial Protection',
      title: 'Safe Escrow Payment Vault',
      tagline: 'You inspect the work before a single dollar is paid',
      description:
        'When you book, your payment is held safely in escrow. The specialist only receives funds after you inspect the completed repair and give your digital sign-off, or after 48 dispute-free hours.',
      icon: Lock,
      features: [
        'Pre-authorized funds held securely in escrow',
        'Payment released strictly upon your sign-off',
        '$2,500 craftsmanship dispute guarantee',
      ],
      linkText: 'See how escrow protects you',
      linkHref: '/trust',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#E4E7EC]">
      <Container>
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF1F8] border border-[#173B67]/20 text-[#173B67] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#0F9D91]" />
            <span>Why Homeowners Trust SkillConnect</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#173B67] tracking-tight">
            Everything You Need in a Home Pro. <br className="hidden sm:inline" />
            <span className="text-[#0F9D91]">None of the Traditional Risks.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#667085] mt-3 leading-relaxed max-w-2xl mx-auto">
            SkillConnect eliminates the three biggest headaches in home repair: unverified contractors, hidden surprise invoices, and contractor abandonment.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#F7F8FA] border border-[#E4E7EC] hover:border-[#173B67]/30 hover:shadow-lg transition-all duration-300 relative group"
              >
                <div>
                  {/* Top Bar with Number & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-[#E4E7EC] text-[#173B67]">
                      Pillar {pillar.step}
                    </span>
                    <span className="text-[11px] font-bold text-[#0F9D91] bg-[#E6F7F5] px-2.5 py-0.5 rounded-full border border-[#0F9D91]/20">
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="w-12 h-12 rounded-2xl bg-[#173B67] text-white flex items-center justify-center mb-5 group-hover:bg-[#0F9D91] transition-colors shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-[#173B67] tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#0F9D91] mt-1">
                    {pillar.tagline}
                  </p>

                  <p className="text-xs sm:text-sm text-[#667085] mt-3 leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Bullet Highlights */}
                  <ul className="mt-5 space-y-2 border-t border-[#E4E7EC] pt-4">
                    {pillar.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-xs text-[#263445]">
                        <CheckCircle2 className="w-4 h-4 text-[#0F9D91] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA */}
                <div className="mt-6 pt-4 border-t border-[#E4E7EC]">
                  <Link
                    href={pillar.linkHref}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173B67] hover:text-[#0F9D91] transition-colors group-hover:translate-x-0.5"
                  >
                    <span>{pillar.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
