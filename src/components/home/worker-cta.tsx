import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Shield, Calendar, DollarSign } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export function WorkerCTA() {
  const benefits = [
    'Zero upfront lead fees — only keep what you earn',
    'Same-day direct payouts via Stripe Express',
    'Set your own diagnostic fees & hourly rates',
    '1-click "Available Today" urgent dispatch toggle',
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-[#143d35] via-[#1b4d43] to-[#143d35] text-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 flex flex-col gap-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#a4e2c6]">
              For Independent Trade Technicians
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Are You a Skilled Local Professional?
            </h2>

            <p className="text-sm sm:text-base text-[#e7f4ed]/80 leading-relaxed max-w-xl">
              Stop paying upfront for junk leads that go nowhere. Join SkillConnect to connect with real local clients, manage your weekly schedule, and get paid automatically upon verified job completion.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-2 text-xs text-[#e7f4ed]">
                  <CheckCircle2 className="w-4 h-4 text-[#a4e2c6] flex-shrink-0" />
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
                  className="font-bold text-[#143d35] bg-white hover:bg-[#e7f4ed]"
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
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-lg">
                  ⚡
                </div>
                <div>
                  <h4 className="font-bold text-base">Marcus Vance (Plumber)</h4>
                  <p className="text-xs text-[#e7f4ed]/70">Earned $3,840 this month on SkillConnect</p>
                </div>
              </div>

              <div className="py-4 space-y-3 text-xs text-[#e7f4ed]/90">
                <div className="flex justify-between items-center">
                  <span>Weekly Booked Jobs</span>
                  <span className="font-bold text-white">8 Jobs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Customer Rating</span>
                  <span className="font-bold text-[#f2b66d]">4.95 ★ (142 reviews)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Disputed Invoices</span>
                  <span className="font-bold text-[#a4e2c6]">0% (Full escrow release)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/15 text-[11px] text-[#e7f4ed]/70 italic">
                &ldquo;No bidding wars, no paying $40 per contact lead. Clients book directly based on my license and real reviews.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
