'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  User,
  Wrench,
  Shield,
  Key,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { UserRole } from '@/types/auth';

interface DemoCard {
  role: UserRole;
  name: string;
  tagline: string;
  avatarUrl: string;
  email: string;
  badge: string;
  badgeClass: string;
  targetPath: string;
  features: string[];
}

const DEMO_CARDS: DemoCard[] = [
  {
    role: 'customer',
    name: 'Sarah Jenkins',
    tagline: 'Homeowner & Service Buyer',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    email: 'sarah.jenkins@example.com',
    badge: 'Customer Demo',
    badgeClass: 'bg-blue-50 text-[#173B67] border-blue-200',
    targetPath: '/customer/dashboard',
    features: [
      'Pre-scheduled service with Master Electrician Marcus Vance',
      'Completed plumbing service ready for verified review',
      'Interactive 4-step booking flow with escrow pre-authorization',
      'Saved favorite specialists & profile address manager',
    ],
  },
  {
    role: 'worker',
    name: 'Marcus Vance',
    tagline: 'Licensed Master Electrician',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
    email: 'marcus.vance@example.com',
    badge: 'Pro Worker Demo',
    badgeClass: 'bg-emerald-50 text-[#0F9D91] border-emerald-200',
    targetPath: '/worker/dashboard',
    features: [
      'Live incoming job requests: accept or decline customer bookings',
      'Service & pricing editor: customize hourly rates & diagnostic fees',
      'Weekly operating schedule & emergency dispatch availability',
      'License verification submission & reply to homeowner reviews',
    ],
  },
  {
    role: 'admin',
    name: 'Alex Rivera',
    tagline: 'Director of Trust & Operations',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    email: 'admin@skillconnect.local',
    badge: 'Admin Desk Demo',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    targetPath: '/admin',
    features: [
      'Role-based security protecting administrative oversight',
      'Credential audit queue: Approve or Reject contractor licenses',
      'Escrow mediation: release funds or issue homeowner refunds',
      'Real-time marketplace metrics: GMV and verified contractor health',
    ],
  },
];

export function DemoAccountsShowcase() {
  const { login, role: activeRole } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleLaunch = (demo: DemoCard) => {
    login(demo.email, demo.role);
    showToast({
      type: 'success',
      title: `Logged in as ${demo.name}`,
      message: `Active persona: ${demo.tagline}. Navigating to portal...`,
    });
    router.push(demo.targetPath);
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#E4E7EC]">
      <Container>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF1F8] border border-[#173B67]/20 text-[#173B67] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#0F9D91]" />
            <span>Interactive Demo Accounts</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#173B67] tracking-tight">
            Experience SkillConnect from Any Perspective
          </h2>
          <p className="text-sm sm:text-base text-[#667085] mt-2 leading-relaxed">
            Test the entire local-services ecosystem with 1-click demo accounts. Switch seamlessly between customer discovery, pro contractor operations, and administrative verification.
          </p>
        </div>

        {/* 3 Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {DEMO_CARDS.map((demo) => {
            const isCurrent = activeRole === demo.role;

            return (
              <div
                key={demo.role}
                className={`flex flex-col justify-between p-6 sm:p-7 rounded-3xl border transition-all duration-200 ${
                  isCurrent
                    ? 'border-[#0F9D91] bg-[#F7FBFB] shadow-md ring-2 ring-[#0F9D91]/20'
                    : 'border-[#E4E7EC] bg-[#F7F8FA] hover:bg-white hover:border-[#173B67]/30 hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Top Pill & Avatar */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${demo.badgeClass}`}
                    >
                      {demo.badge}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Currently Active
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-xs flex-shrink-0 bg-slate-100">
                      <Image
                        src={demo.avatarUrl}
                        alt={demo.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#173B67]">{demo.name}</h3>
                      <p className="text-xs text-[#667085] mt-0.5">{demo.tagline}</p>
                      <span className="font-mono text-[10px] text-[#0F9D91] font-semibold block mt-0.5">
                        {demo.email}
                      </span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="pt-3 border-t border-[#E4E7EC] mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085] block mb-2">
                      Included Workflows:
                    </span>
                    <ul className="space-y-2 text-xs text-[#263445]">
                      {demo.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0F9D91] flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 1-Click Action Button */}
                <button
                  type="button"
                  onClick={() => handleLaunch(demo)}
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    isCurrent
                      ? 'bg-[#173B67] text-white hover:bg-[#0F2A4A] shadow-xs'
                      : 'bg-[#0F9D91] text-white hover:bg-[#0D877D] shadow-sm hover:shadow'
                  }`}
                >
                  <span>{isCurrent ? `Open ${demo.name.split(' ')[0]}'s Portal` : `Experience as ${demo.name}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner with Credentials Summary */}
        <div className="mt-10 p-5 rounded-2xl bg-[#EBF1F8] border border-[#173B67]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-[#173B67]">
            <Key className="w-4 h-4 text-[#0F9D91] flex-shrink-0" />
            <span>
              <strong>Manual Credentials Available:</strong> Passwords for all demo accounts are formatted as <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[11px] border border-[#173B67]/10">[Role]Demo2026!</code> (e.g., <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[11px] border border-[#173B67]/10">CustomerDemo2026!</code>).
            </span>
          </div>

          <Link
            href="/login"
            className="font-bold text-[#173B67] hover:text-[#0F9D91] transition-colors whitespace-nowrap flex items-center gap-1"
          >
            <span>Go to Standard Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
