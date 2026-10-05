'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Sparkles, Shield, Wrench, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { MobileNav } from '@/components/layout/mobile-nav';

export function SiteHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      {/* Top Demo Banner */}
      <div className="bg-[#143d35] text-[#e7f4ed] text-xs py-2 px-4 border-b border-[#237a63]/30">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full bg-[#237a63] text-white text-[10px] tracking-wide uppercase">
              Phase 1 MVP
            </span>
            <span className="hidden sm:inline text-white/90">
              Interactive UI Prototype: Upfront pricing, verified trades, and milestone protection.
            </span>
            <span className="sm:hidden text-white/90">Interactive UI Prototype</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#e7f4ed]/80">
            <Link href="/customer/dashboard" className="hover:text-white underline decoration-white/30">
              Customer Demo
            </Link>
            <span className="text-[#237a63]">•</span>
            <Link href="/worker/dashboard" className="hover:text-white underline decoration-white/30">
              Worker Demo
            </Link>
          </div>
        </Container>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e3e8e3] transition-all">
        <Container className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Branding */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#143d35] flex items-center justify-center text-white shadow-sm group-hover:bg-[#237a63] transition-colors">
              <Wrench className="w-5 h-5 text-[#e7f4ed]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#172522]">
                Skill<span className="text-[#237a63]">Connect</span>
              </span>
              <span className="text-[10px] text-[#66716d] -mt-1 tracking-wider uppercase font-medium">
                Verified Local Services
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/services"
              className="text-sm font-medium text-[#172522] hover:text-[#237a63] transition-colors"
            >
              All Services
            </Link>
            <Link
              href="/professionals"
              className="text-sm font-medium text-[#172522] hover:text-[#237a63] transition-colors"
            >
              Find Professionals
            </Link>
            <Link
              href="/customer/dashboard"
              className="text-sm font-medium text-[#66716d] hover:text-[#172522] transition-colors"
            >
              Customer Demo
            </Link>
            <Link
              href="/worker/dashboard"
              className="text-sm font-medium text-[#66716d] hover:text-[#172522] transition-colors"
            >
              Worker Demo
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="md">
                Sign In
              </Button>
            </Link>
            <Link href="/register?role=worker">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Join as a Pro
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link href="/login" className="sm:hidden">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 rounded-xl text-[#172522] hover:bg-[#f8f8f4] border border-[#e3e8e3] transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </Container>
      </header>

      {/* Slide-out Mobile Nav */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
