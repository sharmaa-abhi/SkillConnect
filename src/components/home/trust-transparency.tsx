import React from 'react';
import { ShieldCheck, Scale, Lock, HeartHandshake } from 'lucide-react';
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
      title: 'Fair Dispute Mediation',
      description: 'Dedicated platform mediation with photo evidence reviews. If work fails building standards, corrective service is covered.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#f8f8f4] border-b border-[#e3e8e3]">
      <Container>
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#237a63]">
            Trust & Security
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#172522] mt-1 tracking-tight">
            Built on Transparency, Not Surprise Fees
          </h2>
          <p className="text-sm text-[#66716d] mt-2 leading-relaxed">
            We built SkillConnect to protect homeowners from bait-and-switch quotes and protect tradespeople from predatory lead generation fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-[#e3e8e3] shadow-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-[#e7f4ed] text-[#237a63] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#172522]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#66716d] mt-1.5 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
