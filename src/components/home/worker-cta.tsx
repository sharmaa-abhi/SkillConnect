import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export function WorkerCTA() {
  const benefits = [
    'Zero upfront lead fees — keep what you earn',
    'Direct payouts via Stripe Express auto-release',
    'Set your own diagnostic fees & hourly rates',
    '1-click "Available Today" urgent dispatch toggle',
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#173B67] text-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 flex flex-col gap-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D91]">
              For Independent Trade Technicians
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Are You a Skilled Local Professional?
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
              Stop paying upfront for low-quality leads. Join SkillConnect to connect with real local clients, manage your weekly schedule, and receive automated payouts upon verified job sign-off.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-2 text-xs text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#0F9D91] flex-shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link href="/register?role=worker">
                <Button
                  variant="secondary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold shadow-xs"
                >
                  Create a Free Pro Profile
                </Button>
              </Link>
              <Link href="/worker/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Explore Worker Demo Portal
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 text-white shadow-xl">
              <div className="flex items-center gap-3 pb-4 border-b border-white/15">
                <div className="w-12 h-12 rounded-2xl bg-[#0F9D91] flex items-center justify-center font-bold text-lg text-white">
                  ⚡
                </div>
                <div>
                  <h4 className="font-bold text-base">Marcus Vance (Master Plumber)</h4>
                  <p className="text-xs text-white/70">Earned $4,280 this month on SkillConnect</p>
                </div>
              </div>

              <div className="py-4 space-y-3 text-xs text-white/90">
                <div className="flex justify-between items-center">
                  <span>Weekly Booked Jobs</span>
                  <span className="font-bold text-white">8 Scheduled</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Customer Rating</span>
                  <span className="font-bold text-[#E7A83E]">4.95 ★ (142 reviews)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Disputed Invoices</span>
                  <span className="font-bold text-[#15803D]">0% (Full escrow release)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/15 text-[11px] text-white/70 italic">
                &ldquo;No bidding wars, no paying $40 per lead. Clients book directly based on my verified license and real customer reviews.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
