'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('SkillConnect UI Error Boundary:', error);
  }, [error]);

  return (
    <div className="py-20 bg-[#f8f8f4]">
      <Container size="narrow" className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-[#b42318] flex items-center justify-center mx-auto mb-4 border border-red-200">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#172522]">
          Something unexpected happened
        </h1>

        <p className="text-xs sm:text-sm text-[#66716d] mt-2 mb-6 leading-relaxed">
          An error occurred while loading this view. You can reload the page or return to the main directory.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            onClick={() => reset()}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Try Again
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              leftIcon={<Home className="w-4 h-4" />}
            >
              Return Home
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
