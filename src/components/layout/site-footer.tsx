import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { ShieldCheck, Clock, Award, Heart, CheckCircle2 } from 'lucide-react';
import { serviceCategories } from '@/data/services';

export function SiteFooter() {
  return (
    <footer className="bg-[#173B67] text-white pt-16 pb-12 border-t border-[#173B67]/40">
      <Container>
        {/* Core Value Props Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0F9D91]/20 border border-[#0F9D91]/40 flex items-center justify-center text-[#0F9D91] flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#0F9D91]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Multi-Tier Verification</h4>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                State trade licenses, active liability insurance, and government biometric verification standard on every professional.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0F9D91]/20 border border-[#0F9D91]/40 flex items-center justify-center text-[#0F9D91] flex-shrink-0">
              <Clock className="w-6 h-6 text-[#0F9D91]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Upfront Diagnostic Pricing</h4>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                Standardized inspection fees credited 100% toward completed labor. No hidden charges or predatory lead fees.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0F9D91]/20 border border-[#0F9D91]/40 flex items-center justify-center text-[#0F9D91] flex-shrink-0">
              <Award className="w-6 h-6 text-[#0F9D91]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Escrow-Style Milestone Hold</h4>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                Funds are pre-authorized upon booking and released to the tradesperson only upon satisfactory customer sign-off.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-white/10 text-sm">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#0F9D91] flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="font-bold text-lg text-white">SkillConnect</span>
            </Link>
            <p className="text-xs text-white/70 leading-relaxed mb-4">
              Connecting homeowners with certified, independent trade professionals across our metropolitan network.
            </p>
            <p className="text-xs text-white/60">
              Find trusted help. Book confidently. Get the job done.
            </p>
          </div>

          {/* Trade Services */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Local Trade Services
            </h5>
            <ul className="flex flex-col gap-2.5 text-xs text-white/80">
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
                <Link href="/services" className="text-[#0F9D91] hover:underline font-semibold">
                  View all services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Marketplace Portals
            </h5>
            <ul className="flex flex-col gap-2.5 text-xs text-white/80">
              <li>
                <Link href="/professionals" className="hover:text-white transition-colors">
                  Find Local Pros
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Services Catalog
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
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Verification Desk
                </Link>
              </li>
              <li>
                <Link href="/trust" className="text-[#0F9D91] hover:underline font-bold">
                  How It Works &amp; Trust →
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust Guarantees */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Craftsmanship Trust
            </h5>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80 leading-relaxed flex flex-col gap-2">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-[#0F9D91]" />
                <span>$2,500 Workmanship Guarantee</span>
              </div>
              <p className="text-[11px] text-white/70">
                All bookings completed through SkillConnect are protected against defective trade workmanship and non-performance.
              </p>
              <Link
                href="/trust"
                className="text-[#0F9D91] hover:text-white transition-colors font-bold text-[11px] mt-1 inline-flex items-center gap-1"
              >
                <span>Read our full Trust &amp; Safety charter</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} SkillConnect Platform. All rights reserved.</p>
          <div className="flex items-center gap-1 text-white/70">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#E7A83E] fill-[#E7A83E]" />
            <span>for local trade excellence</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
