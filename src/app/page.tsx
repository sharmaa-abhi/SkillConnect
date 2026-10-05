import React from 'react';
import { HeroSection } from '@/components/home/hero-section';
import { ServiceCategories } from '@/components/home/service-categories';
import { FeaturedPros } from '@/components/home/featured-pros';
import { HowItWorks } from '@/components/home/how-it-works';
import { TrustTransparency } from '@/components/home/trust-transparency';
import { WorkerCTA } from '@/components/home/worker-cta';
import { FAQSection } from '@/components/home/faq-section';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ServiceCategories />
      <FeaturedPros />
      <HowItWorks />
      <TrustTransparency />
      <WorkerCTA />
      <FAQSection />
    </div>
  );
}
