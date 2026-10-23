import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { ShieldCheck, Clock, Award, Heart, CheckCircle2, Lock, CreditCard, Calendar } from 'lucide-react';
import { serviceCategories } from '@/data/services';

export function SiteFooter() {
  return (
    <footer className="bg-[#0B0F0E] text-white pt-16 pb-12 border-t border-white/10">
      <Container>
        {/* Core Value Props Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#16A34A]/20 border border-[#16A34A]/40 flex items-center justify-center text-[#16A34A] shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#16A34A]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Multi-Tier Verification</h4>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                State trade licenses, active liability insurance, and government biometric verification standard on every professional.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center text-[#2563EB] shrink-0">
              <Clock className="w-6 h-6 text-[#2563EB]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Upfront Diagnostic Pricing</h4>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                Standardized inspection fees credited 100% toward completed labor. No hidden charges or predatory lead fees.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#16A34A]/20 border border-[#16A34A]/40 flex items-center justify-center text-[#16A34A] shrink-0">
              <Award className="w-6 h-6 text-[#16A34A]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Escrow Milestone Protection</h4>
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
              <div className="w-8 h-8 rounded-lg bg-[#16A34A] flex items-center justify-center text-white font-bold">
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
              {serviceCategories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/services/${cat.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-[#16A34A] hover:underline font-semibold">
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
                <Link href="/booking" className="hover:text-white transition-colors">
                  Booking History
                </Link>
              </li>
              <li>
                <Link href="/payments" className="hover:text-white transition-colors">
                  Escrow &amp; Payments
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors">
                  Escrow Process
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
                <Link href="/trust" className="text-[#16A34A] hover:underline font-bold">
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
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>$2,500 Workmanship Guarantee</span>
              </div>
              <p className="text-[11px] text-white/70">
                All bookings completed through SkillConnect are protected against defective trade workmanship and non-performance.
              </p>
              <Link
                href="/trust"
                className="text-[#16A34A] hover:text-white transition-colors font-bold text-[11px] mt-1 inline-flex items-center gap-1"
              >
                <span>Read our full Trust &amp; Safety charter</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Prototype Simulated Data Disclosure */}
        <div className="py-4 px-5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80 my-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2">
            <span className="font-bold text-[#16A34A] shrink-0">Prototype — Simulated Data:</span>
            <span className="text-white/70 text-[11px] sm:text-xs leading-relaxed">
              Some professional listings, estimates, dashboard metrics, and payment statuses may use simulated data. They do not represent verified live availability or actual financial transactions.
            </span>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} SkillConnect Platform. All rights reserved.</p>
          <div className="flex items-center gap-1 text-white/70">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#16A34A] fill-[#16A34A]" />
            <span>for local trade excellence</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
