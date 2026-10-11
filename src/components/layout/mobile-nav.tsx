'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Users,
  ShieldCheck,
  Briefcase,
  LayoutDashboard,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user, role, switchRole, logout } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { label: 'Browse Services', href: '/services', icon: Search },
    { label: 'Find Professionals', href: '/professionals', icon: Users },
    { label: 'Customer Dashboard', href: '/customer/dashboard', icon: LayoutDashboard },
    { label: 'Worker Dashboard', href: '/worker/dashboard', icon: Briefcase },
    { label: 'Admin Verification Desk', href: '/admin', icon: ShieldAlert },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Slide-out drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E4E7EC]">
                <Link href="/" onClick={onClose} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#173B67] flex items-center justify-center text-white font-bold text-base">
                    S
                  </div>
                  <span className="font-bold text-lg text-[#173B67]">SkillConnect</span>
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close navigation menu"
                  className="p-2 -mr-2 rounded-lg text-[#667085] hover:text-[#263445] hover:bg-[#F7F8FA]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Active Role Quick Switch */}
              <div className="mt-4 p-3 rounded-xl bg-[#F7F8FA] border border-[#E4E7EC]">
                <span className="text-[11px] font-bold text-[#667085] block mb-1.5 uppercase tracking-wider">
                  Current User ({user.name.split(' ')[0]})
                </span>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => switchRole('customer')}
                    className={`py-1 text-center rounded-lg text-xs font-bold transition-all ${
                      role === 'customer'
                        ? 'bg-[#173B67] text-white'
                        : 'bg-white text-[#263445] border border-[#E4E7EC]'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => switchRole('worker')}
                    className={`py-1 text-center rounded-lg text-xs font-bold transition-all ${
                      role === 'worker'
                        ? 'bg-[#0F9D91] text-white'
                        : 'bg-white text-[#263445] border border-[#E4E7EC]'
                    }`}
                  >
                    Worker
                  </button>
                  <button
                    type="button"
                    onClick={() => switchRole('admin')}
                    className={`py-1 text-center rounded-lg text-xs font-bold transition-all ${
                      role === 'admin'
                        ? 'bg-[#173B67] text-white'
                        : 'bg-white text-[#263445] border border-[#E4E7EC]'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Navigation links */}
              <nav className="mt-6 flex flex-col gap-1.5">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#263445] hover:bg-[#EBF1F8] hover:text-[#173B67] transition-colors"
                    >
                      <Icon className="w-4 h-4 text-[#0F9D91]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t border-[#E4E7EC] flex flex-col gap-3">
                <Link href="/register?role=worker" onClick={onClose}>
                  <Button variant="secondary" className="w-full justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Join as a Pro
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="py-2 text-xs font-semibold text-[#B42318] hover:bg-red-50 rounded-xl transition-colors text-center"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Prototype notice badge */}
            <div className="mt-8 pt-4 border-t border-[#E4E7EC]">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-[#F7F8FA] border border-[#E4E7EC] text-xs text-[#667085]">
                <ShieldCheck className="w-4 h-4 text-[#0F9D91] flex-shrink-0 mt-0.5" />
                <span>Verified trade licenses, upfront diagnostic fees & escrow protection.</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
