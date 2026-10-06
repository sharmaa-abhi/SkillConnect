import React from 'react';
import Link from 'next/link';
import { Search, Home, Wrench, ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { serviceCategories } from '@/data/services';

export default function NotFound() {
  return (
    <div className="py-20 sm:py-28 bg-[#f8f8f4]">
      <Container size="narrow" className="max-w-xl text-center">
        {/* Visual Badge */}
        <div className="w-16 h-16 rounded-3xl bg-[#e7f4ed] text-[#237a63] flex items-center justify-center mx-auto mb-6 border border-[#237a63]/25 shadow-xs">
          <Wrench className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-[#237a63]">
          404 Error
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172522] mt-2 tracking-tight">
          We couldn&apos;t find that page
        </h1>

        <p className="text-sm sm:text-base text-[#66716d] mt-3 leading-relaxed">
          The link you followed may be broken or the page may have been removed. Let&apos;s get you back on track with trusted local help.
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
        <div className="mt-12 pt-8 border-t border-[#e3e8e3]">
          <span className="text-xs font-semibold text-[#66716d] uppercase tracking-wider block mb-3">
            Popular Trade Shortcuts
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {serviceCategories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                href={`/professionals?category=${cat.slug}`}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-[#e3e8e3] text-[#172522] hover:bg-[#e7f4ed] hover:text-[#143d35] hover:border-[#237a63]/30 transition-all shadow-2xs"
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
