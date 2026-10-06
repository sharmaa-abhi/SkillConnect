import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { ShieldCheck, Clock, Award, Heart } from 'lucide-react';
import { serviceCategories } from '@/data/services';

export function SiteFooter() {
  return (
    <footer className="bg-[#143d35] text-white pt-16 pb-12 border-t border-[#237a63]/40">
      <Container>
        {/* Core Value Props Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#237a63]/40 border border-[#237a63] flex items-center justify-center text-[#e7f4ed] flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">Multi-Tier Verification</h4>
              <p className="text-xs text-[#e7f4ed]/80 mt-1 leading-relaxed">
                State trade licenses, active liability insurance, and government ID verification standard on every professional.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#237a63]/40 border border-[#237a63] flex items-center justify-center text-[#e7f4ed] flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">Upfront Diagnostic Pricing</h4>
              <p className="text-xs text-[#e7f4ed]/80 mt-1 leading-relaxed">
                Transparent inspection fees credited toward completed labor. No surprise hidden charges or bait-and-switch quotes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#237a63]/40 border border-[#237a63] flex items-center justify-center text-[#e7f4ed] flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">Escrow-Style Protection</h4>
              <p className="text-xs text-[#e7f4ed]/80 mt-1 leading-relaxed">
                Funds are pre-authorized upon booking and released only upon satisfactory customer inspection and sign-off.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-white/10 text-sm">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#237a63] flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="font-bold text-lg text-white">SkillConnect</span>
            </Link>
            <p className="text-xs text-[#e7f4ed]/70 leading-relaxed mb-4">
              Connecting homeowners with certified, independent trade professionals across our metropolitan network.
            </p>
            <p className="text-xs text-[#e7f4ed]/60">
              Find trusted help. Book confidently. Get the job done.
            </p>
          </div>

          {/* Trade Services */}
          <div>
            <h5 className="font-semibold text-[#e7f4ed] text-xs uppercase tracking-wider mb-4">
              Local Trade Services
            </h5>
            <ul className="flex flex-col gap-2.5 text-xs text-[#e7f4ed]/80">
              {serviceCategories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/professionals?category=${cat.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-[#a4e2c6] hover:underline font-medium">
                  View all 7 services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-[#e7f4ed] text-xs uppercase tracking-wider mb-4">
              Discovery & Booking
            </h5>
            <ul className="flex flex-col gap-2.5 text-xs text-[#e7f4ed]/80">
              <li>
                <Link href="/professionals" className="hover:text-white transition-colors">
                  Find Local Pros
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Services Directory
                </Link>
              </li>
              <li>
                <Link href="/customer/dashboard" className="hover:text-white transition-colors">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/worker/dashboard" className="hover:text-white transition-colors">
                  Pro Worker Portal
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In / Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Prototype Disclosure */}
          <div>
            <h5 className="font-semibold text-[#e7f4ed] text-xs uppercase tracking-wider mb-4">
              Prototype Notice
            </h5>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#e7f4ed]/80 leading-relaxed">
              <p className="font-medium text-white mb-1">Phase 1 UI/UX MVP</p>
              <p className="text-[11px] text-[#e7f4ed]/70">
                This website is a demonstration prototype. All technician records, reviews, and bookings are simulated with local state.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#e7f4ed]/60">
          <p>© {new Date().getFullYear()} SkillConnect Platform. Phase 1 UI/UX Demonstration.</p>
          <div className="flex items-center gap-1 text-[#e7f4ed]/70">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#f2b66d] fill-[#f2b66d]" />
            <span>for local service excellence</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
