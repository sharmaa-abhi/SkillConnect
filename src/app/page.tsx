import React from 'react';
import { HeroSection } from '@/components/home/hero-section';
import { DemoAccountsShowcase } from '@/components/home/demo-accounts-showcase';
import { ServiceCategories } from '@/components/home/service-categories';
import { AICostEstimator } from '@/components/pricing/ai-cost-estimator';
import { FeaturedPros } from '@/components/home/featured-pros';
import { HowItWorks } from '@/components/home/how-it-works';
import { TrustTransparency } from '@/components/home/trust-transparency';
import { WorkerCTA } from '@/components/home/worker-cta';
import { FAQSection } from '@/components/home/faq-section';
import { Container } from '@/components/layout/container';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <DemoAccountsShowcase />
      <ServiceCategories />
      
      {/* AI Estimation & Instant Scope Section */}
      <section id="estimator" className="py-16 sm:py-20 bg-[#F7F8FA] border-b border-[#E4E7EC]">
        <Container size="default">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D91]">
              Smart Pricing Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#173B67] mt-1 tracking-tight">
              Instant AI Cost Estimator & Pro Match
            </h2>
            <p className="text-sm text-[#667085] mt-2">
              Describe your repair or installation to receive a benchmark pricing estimate and connect with top-ranked verified specialists.
            </p>
          </div>

          <AICostEstimator />
        </Container>
      </section>

      <FeaturedPros />
      <HowItWorks />
      <TrustTransparency />
      <WorkerCTA />
      <FAQSection />
    </div>
  );
}
