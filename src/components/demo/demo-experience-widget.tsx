'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Sparkles,
  X,
  ShieldCheck,
  RotateCcw,
  Copy,
  Check,
  ArrowRight,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { resetAllDemoData } from '@/lib/demo-storage';
import { UserRole } from '@/types/auth';

interface DemoPersona {
  role: UserRole;
  name: string;
  title: string;
  email: string;
  password: string;
  avatarUrl: string;
  badgeColor: string;
  targetPath: string;
  description: string;
  highlights: string[];
}

const DEMO_PERSONAS: DemoPersona[] = [
  {
    role: 'customer',
    name: 'Sarah Jenkins',
    title: 'San Francisco Homeowner',
    email: 'sarah.jenkins@example.com',
    password: 'CustomerDemo2026!',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    badgeColor: 'bg-blue-50 text-[#173B67] border-blue-200',
    targetPath: '/customer/dashboard',
    description: 'Experience SkillConnect from the customer perspective: discovery, transparent booking, and review submission.',
    highlights: [
      'Active scheduled electrical booking with Elena Rodriguez',
      'Completed plumbing service eligible for verified review submission',
      'Saved favorites list and address management',
      '4-step booking flow with diagnostic fee credit and escrow pre-authorization',
    ],
  },
  {
    role: 'worker',
    name: 'Marcus Vance',
    title: 'Master Plumber (License #CA-LIC #982410-C36)',
    email: 'marcus.vance@example.com',
    password: 'WorkerDemo2026!',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
    badgeColor: 'bg-emerald-50 text-[#0F9D91] border-emerald-200',
    targetPath: '/worker/dashboard',
    description: 'Experience the pro worker portal: dispatch queue, service pricing, verification submission, and review replies.',
    highlights: [
      'Live dispatch queue: accept or decline incoming customer requests',
      'Pricing manager: update hourly rates and diagnostic fee in real time',
      'Weekly operating schedule & emergency availability switch',
      'Verification center: submit license & insurance documentation',
      'Reply to homeowner reviews & inspect $1,420 escrow payouts ledger',
    ],
  },
  {
    role: 'admin',
    name: 'Alex Rivera',
    title: 'Director of Trust & Operations',
    email: 'admin@skillconnect.local',
    password: 'AdminSecurity2026!',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    targetPath: '/admin',
    description: 'Experience platform administration: credential auditing, escrow mediation, and marketplace health.',
    highlights: [
      'Role-based access control protecting platform oversight endpoints',
      'Verification audit queue: inspect and Approve/Reject contractor credentials',
      'Escrow dispute mediation: force-release or refund disputed bookings',
      'Live marketplace metrics: $18,450 GMV and 98.4% resolution rate',
    ],
  },
];

export function DemoExperienceWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { user, role, login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      showToast({
        type: 'info',
        title: 'Copied to Clipboard',
        message: text,
      });
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleSwitchPersona = (persona: DemoPersona) => {
    login(persona.email, persona.role);
    setIsOpen(false);
    showToast({
      type: 'success',
      title: `Switched to ${persona.name}`,
      message: `Logged in as ${persona.title}. Opening portal...`,
    });
    router.push(persona.targetPath);
  };

  const handleResetData = () => {
    resetAllDemoData();
    showToast({
      type: 'info',
      title: 'Demo Data Reset',
      message: 'All demo bookings, worker requests, reviews, and rates have been restored to defaults.',
    });
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Bottom-Left Trigger Pill */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[#173B67] text-white shadow-xl hover:bg-[#0F2A4A] transition-all hover:scale-105 border border-white/20 group"
          aria-label="Open Demo Accounts & Experience Hub"
        >
          <div className="w-6 h-6 rounded-full bg-[#0F9D91] text-white flex items-center justify-center text-xs font-bold animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left leading-tight pr-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0F9D91]">
              Demo Accounts
            </span>
            <span className="text-xs font-medium text-white/90">
              Active: <strong className="font-bold text-white">{user.name.split(' ')[0]} ({role})</strong>
            </span>
          </div>
          <ChevronUp className="w-4 h-4 text-white/70 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Modal Backdrop & Container */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-4xl rounded-3xl border border-[#E4E7EC] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-modal-title"
          >
            {/* Header */}
            <div className="p-6 sm:p-7 bg-[#173B67] text-white flex items-start justify-between gap-4 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F9D91] text-white text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Instant Experience Switcher
                </div>
                <h2 id="demo-modal-title" className="text-2xl font-black text-white">
                  SkillConnect Demo Accounts
                </h2>
                <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-2xl leading-relaxed">
                  Select any persona below to immediately experience the platform with pre-configured data. Switch between customer, pro contractor, and marketplace administrator with zero setup.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Persona Cards Grid */}
            <div className="p-6 sm:p-7 overflow-y-auto divide-y divide-[#E4E7EC] sm:divide-y-0 sm:grid sm:grid-cols-3 sm:gap-5">
              {DEMO_PERSONAS.map((persona) => {
                const isActive = user.email === persona.email;

                return (
                  <div
                    key={persona.role}
                    className={`flex flex-col justify-between p-5 rounded-2xl border transition-all ${
                      isActive
                        ? 'border-[#0F9D91] bg-[#E6F7F5]/30 ring-2 ring-[#0F9D91]/20 shadow-sm'
                        : 'border-[#E4E7EC] bg-white hover:border-[#173B67]/30 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Avatar & Role Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xs flex-shrink-0 bg-slate-100">
                          <Image
                            src={persona.avatarUrl}
                            alt={persona.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-sm text-[#263445]">{persona.name}</h3>
                            {isActive && (
                              <span className="text-[10px] font-bold text-[#15803D] bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                                Active
                              </span>
                            )}
                          </div>
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${persona.badgeColor}`}
                          >
                            {persona.role.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#173B67] font-semibold mb-2">
                        {persona.title}
                      </p>

                      <p className="text-xs text-[#667085] leading-relaxed mb-4">
                        {persona.description}
                      </p>

                      {/* Credentials Pill Box */}
                      <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E4E7EC] text-[11px] space-y-1.5 mb-4">
                        <div className="flex items-center justify-between text-[#667085]">
                          <span>Email:</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(persona.email, `${persona.role}-email`)}
                            className="font-mono text-[#263445] font-semibold flex items-center gap-1 hover:text-[#0F9D91]"
                            title="Copy Email"
                          >
                            <span>{persona.email}</span>
                            {copiedKey === `${persona.role}-email` ? (
                              <Check className="w-3 h-3 text-[#15803D]" />
                            ) : (
                              <Copy className="w-3 h-3 text-[#667085]" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-[#667085]">
                          <span>Password:</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(persona.password, `${persona.role}-pwd`)}
                            className="font-mono text-[#263445] font-semibold flex items-center gap-1 hover:text-[#0F9D91]"
                            title="Copy Password"
                          >
                            <span>{persona.password}</span>
                            {copiedKey === `${persona.role}-pwd` ? (
                              <Check className="w-3 h-3 text-[#15803D]" />
                            ) : (
                              <Copy className="w-3 h-3 text-[#667085]" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Key Highlights */}
                      <div className="mb-5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085] block mb-1.5">
                          Experience Features:
                        </span>
                        <ul className="space-y-1 text-xs text-[#263445]">
                          {persona.highlights.map((h, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 leading-snug">
                              <span className="text-[#0F9D91] font-bold mt-0.5">•</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Launch Button */}
                    <button
                      type="button"
                      onClick={() => handleSwitchPersona(persona)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isActive
                          ? 'bg-[#173B67] text-white hover:bg-[#0F2A4A]'
                          : 'bg-[#0F9D91] text-white hover:bg-[#0D877D] shadow-xs'
                      }`}
                    >
                      <span>{isActive ? 'Go to Portal' : `Experience as ${persona.name.split(' ')[0]}`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-[#F7F8FA] border-t border-[#E4E7EC] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#667085]">
                <ShieldCheck className="w-4 h-4 text-[#0F9D91] flex-shrink-0" />
                <span>All actions (creating bookings, changing rates, review submissions) update state in real-time.</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetData}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#667085] hover:text-[#B42318] px-3 py-1.5 rounded-lg border border-[#E4E7EC] bg-white hover:border-[#B42318]/30 transition-colors"
                  title="Reset all test bookings, requests, and customizations to default values"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
