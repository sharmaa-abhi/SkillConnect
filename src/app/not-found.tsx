import React from 'react';
import Link from 'next/link';
import { Home, Wrench } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { serviceCategories } from '@/data/services';

export default function NotFound() {
  return (
    <div className="py-20 sm:py-28 bg-[#F7F8FA]">
      <Container size="narrow" className="max-w-xl text-center">
        {/* Visual Badge */}
        <div className="w-16 h-16 rounded-3xl bg-[#EBF1F8] text-[#173B67] flex items-center justify-center mx-auto mb-6 border border-[#E4E7EC] shadow-2xs">
          <Wrench className="w-8 h-8 text-[#0F9D91]" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-[#0F9D91]">
          404 Error
        </span>

        <h1 className="text-3xl sm:text-4xl font-black text-[#173B67] mt-2 tracking-tight">
          Page Not Found
        </h1>

        <p className="text-sm sm:text-base text-[#667085] mt-3 leading-relaxed">
          The link you followed may be broken or the page may have moved. Let&apos;s get you back on track with trusted local service help.
        </p>

        {/* Primary Return Action */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Home className="w-4 h-4" />}
              className="w-full sm:w-auto font-bold"
            >
              Return to Homepage
            </Button>
          </Link>
          <Link href="/services">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Browse Services Directory
            </Button>
          </Link>
        </div>

        {/* Quick Category Shortcuts */}
        <div className="mt-12 pt-8 border-t border-[#E4E7EC]">
          <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block mb-3">
            Popular Trade Shortcuts
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {serviceCategories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                href={`/professionals?category=${cat.slug}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-[#E4E7EC] text-[#263445] hover:bg-[#EBF1F8] hover:text-[#173B67] hover:border-[#173B67]/30 transition-all shadow-2xs"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
