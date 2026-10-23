'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Banknote,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { PrototypeDisclaimer } from '@/components/ui/prototype-disclaimer';

const escrowSteps = [
  {
    step: 1,
    title: 'Diagnostic Fee Hold',
    description: 'When you book a professional, the diagnostic fee is pre-authorized and held securely in escrow. Your card is not charged — only a hold is placed.',
    icon: CreditCard,
    color: 'text-[#2563EB]',
    bg: 'bg-[#EFF6FF]',
  },
  {
    step: 2,
    title: 'Service & Inspection',
    description: 'The professional arrives, performs the diagnostic inspection, and provides a transparent repair plan with upfront pricing before any work begins.',
    icon: ShieldCheck,
    color: 'text-[#16A34A]',
    bg: 'bg-[#F0FDF4]',
  },
  {
    step: 3,
    title: 'Work Authorization',
    description: 'You review and authorize the repair scope. The diagnostic fee is credited 100% toward your repair labor — you never pay it twice.',
    icon: CheckCircle2,
    color: 'text-[#16A34A]',
    bg: 'bg-[#F0FDF4]',
  },
  {
    step: 4,
    title: 'Completion & Release',
    description: 'After the work is complete and you sign off, escrow funds are released to the professional. If you cancel or decline, funds are refunded in full.',
    icon: Banknote,
    color: 'text-[#16A34A]',
    bg: 'bg-[#F0FDF4]',
  },
];

const protections = [
  {
    title: 'Full Refund on Cancellation',
    description: 'Cancel anytime before work begins for a complete refund of the escrow hold.',
    icon: RefreshCw,
  },
  {
    title: 'Dispute Mediation',
    description: 'If there\'s a disagreement, escrow is locked and our admin team mediates a fair resolution.',
    icon: AlertTriangle,
  },
  {
    title: 'No Hidden Fees',
    description: 'Diagnostic fee is always disclosed upfront and credited toward completed repair labor.',
    icon: Lock,
  },
];

export default function CheckoutPage() {
  return (
    <div className="py-10 sm:py-16 bg-white min-h-screen">
      <Container>
        {/* Disclaimer */}
        <div className="mb-6">
          <PrototypeDisclaimer variant="banner" className="rounded-2xl" />
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="w-14 h-14 rounded-2xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
            Secure Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B0F0E] mt-2 tracking-tight">
            How SkillConnect Payments Work
          </h1>
          <p className="text-sm text-[#6B7280] mt-3 leading-relaxed">
            Every booking is protected by our escrow-based payment system. Your money is held securely and only released when the work is complete and approved.
          </p>
        </div>

        {/* Escrow Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {escrowSteps.map((step) => (
            <div
              key={step.step}
              className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${step.bg} ${step.color} flex items-center justify-center`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#6B7280]">Step {step.step}</span>
              </div>
              <h3 className="font-bold text-sm text-[#0B0F0E] mb-2">{step.title}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed flex-1">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Protection Features */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] mb-12">
          <h2 className="text-lg font-bold text-[#0B0F0E] mb-6">Your Payment Protections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {protections.map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0B0F0E]">{item.title}</h3>
                  <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notice */}
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 mb-12">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-[#0B0F0E] mb-1">Demo Environment Notice</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                This is a demonstration environment. No real payment processing, escrow holding, or financial transactions occur. All payment statuses shown are simulated for evaluation purposes only. No real money is held, charged, or transferred.
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="text-center">
          <h2 className="text-lg font-bold text-[#0B0F0E] mb-2">Ready to Book a Professional?</h2>
          <p className="text-sm text-[#6B7280] mb-6">
            Browse services or find a verified professional to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/services">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Browse Services
              </Button>
            </Link>
            <Link href="/professionals">
              <Button variant="outline" size="lg">
                Find Professionals
              </Button>
            </Link>
            <Link href="/booking">
              <Button variant="outline" size="lg">
                View Your Bookings
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
