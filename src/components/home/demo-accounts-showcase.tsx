'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  User,
  Wrench,
  ShieldAlert,
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
      'Pre-scheduled electrical service with Elena Rodriguez',
      'Completed plumbing service ready for verified review',
      'Interactive 4-step booking flow with escrow pre-authorization',
      'Saved favorite specialists & profile address manager',
    ],
  },
  {
    role: 'worker',
    name: 'Marcus Vance',
    tagline: 'Licensed Master Plumber & Pipe Specialist',
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
  const [isExpanded, setIsExpanded] = useState(false);

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
    <section id="demo-personas" className="py-10 bg-[#EBF1F8]/40 border-b border-[#E4E7EC]">
      <Container>
        {/* Compact Bar (Always Visible) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#173B67]/20 shadow-xs">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="w-10 h-10 rounded-xl bg-[#E6F7F5] text-[#0F9D91] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D91]">
                  Reviewer & Tester Sandbox
                </span>
                <span className="text-[10px] font-bold text-[#173B67] bg-[#EBF1F8] px-2 py-0.5 rounded-full">
                  1-Click Login
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#173B67]">
                Experience SkillConnect from Any Role
              </h3>
            </div>
          </div>

          {/* Quick Action Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
            <button
              type="button"
              onClick={() => handleLaunch(DEMO_CARDS[0])}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeRole === 'customer'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-blue-50 text-[#173B67] border-blue-200 hover:bg-blue-100'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer (Sarah)</span>
            </button>

            <button
              type="button"
              onClick={() => handleLaunch(DEMO_CARDS[1])}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeRole === 'worker'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50 text-[#0F9D91] border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Pro Worker (Marcus)</span>
            </button>

            <button
              type="button"
              onClick={() => handleLaunch(DEMO_CARDS[2])}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeRole === 'admin'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Desk (Alex)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#667085] hover:text-[#173B67] bg-[#F7F8FA] hover:bg-[#E4E7EC] border border-[#E4E7EC] transition-all ml-auto lg:ml-2"
            >
              <span>{isExpanded ? 'Hide Details' : 'View Full Personas'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Expanded Details */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-[#E4E7EC]">
            <div className="text-center max-w-xl mx-auto mb-8">
              <p className="text-xs sm:text-sm text-[#667085]">
                Switch instantly between customer booking, licensed pro operations, and admin trust audit queues without entering passwords.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DEMO_CARDS.map((demo) => {
                const isCurrent = activeRole === demo.role;

                return (
                  <div
                    key={demo.role}
                    className={`flex flex-col justify-between p-6 rounded-3xl border transition-all duration-200 ${
                      isCurrent
                        ? 'border-[#0F9D91] bg-white shadow-md ring-2 ring-[#0F9D91]/20'
                        : 'border-[#E4E7EC] bg-white hover:border-[#173B67]/30 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${demo.badgeClass}`}>
                          {demo.badge}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Currently Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-xs flex-shrink-0 bg-slate-100">
                          <Image
                            src={demo.avatarUrl}
                            alt={demo.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-[#173B67]">{demo.name}</h4>
                          <p className="text-xs text-[#667085] mt-0.5">{demo.tagline}</p>
                          <span className="font-mono text-[10px] text-[#0F9D91] font-semibold block mt-0.5">
                            {demo.email}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-2 mb-6 border-t border-[#E4E7EC] pt-4">
                        {demo.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2 text-xs text-[#667085]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D91] shrink-0 mt-1.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLaunch(demo)}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#0F9D91] text-white hover:bg-[#0c7f75]'
                          : 'bg-[#173B67] text-white hover:bg-[#0f2a4a]'
                      }`}
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>{isCurrent ? 'Re-open Active Portal' : `Launch as ${demo.name.split(' ')[0]}`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
