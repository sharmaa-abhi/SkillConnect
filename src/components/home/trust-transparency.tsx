import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Scale, Lock, HeartHandshake, ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/container';

export function TrustTransparency() {
  const pillars = [
    {
      title: 'Credential & Identity Verification',
      description: 'Every professional holds an active state license, verified biometric identity, and commercial general liability insurance before listing.',
      icon: ShieldCheck,
    },
    {
      title: 'Standardized Diagnostic Fees',
      description: 'Technicians set clear initial evaluation rates. When you authorize the repair, 100% of the diagnostic fee is credited directly toward your bill.',
      icon: Scale,
    },
    {
      title: 'Escrow Milestone Protection',
      description: 'Your payment is safely held during service. Funds are released to the professional only when you are satisfied and sign off.',
      icon: Lock,
    },
    {
      title: 'Craftsmanship Dispute Mediation',
      description: 'Platform mediation with photo evidence reviews. Work failing local building codes is protected by our $2,500 guarantee.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#F7F8FA] border-b border-[#E4E7EC]">
      <Container>
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D91]">
            Trust & Security
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#173B67] mt-1 tracking-tight">
            Built on Transparency, Not Surprise Fees
          </h2>
          <p className="text-sm text-[#667085] mt-2 leading-relaxed">
            We built SkillConnect to protect homeowners from bait-and-switch quotes and protect tradespeople from predatory lead generation fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="flex items-start gap-4 p-6 rounded-3xl bg-white border border-[#E4E7EC] shadow-2xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#E6F7F5] text-[#0F9D91] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#173B67]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#667085] mt-1.5 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Link to Full Trust Charter */}
        <div className="mt-10 text-center">
          <Link
            href="/trust"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#173B67] text-white text-xs sm:text-sm font-bold shadow-xs hover:bg-[#0F2A4A] transition-all hover:scale-105"
          >
            <span>Read How SkillConnect Protects You &amp; Your Money</span>
            <ArrowRight className="w-4 h-4 text-[#0F9D91]" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
