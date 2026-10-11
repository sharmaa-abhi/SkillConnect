'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Wrench,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user, role, switchRole, logout } = useAuth();
  const pathname = usePathname();

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
    {
      label: 'All Services',
      href: '/services',
      icon: Search,
      isActive: pathname === '/services',
    },
    {
      label: 'Find Professionals',
      href: '/professionals',
      icon: Users,
      isActive: pathname.startsWith('/professionals'),
    },
    {
      label: 'How It Works',
      href: '/trust',
      icon: HelpCircle,
      isActive: pathname === '/trust' || pathname === '/how-it-works',
    },
    {
      label: 'Customer Portal',
      href: '/customer/dashboard',
      icon: LayoutDashboard,
      isActive: pathname.startsWith('/customer'),
    },
    {
      label: 'Pro Portal',
      href: '/worker/dashboard',
      icon: Briefcase,
      isActive: pathname.startsWith('/worker'),
    },
    {
      label: 'Admin Trust',
      href: '/admin',
      icon: ShieldAlert,
      isActive: pathname.startsWith('/admin'),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="mobile-navigation-drawer"
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Slide-out Drawer from Right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-[#E4EAF1]"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#E4EAF1]">
                <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#173B67] flex items-center justify-center text-white font-bold">
                    <Wrench className="w-4 h-4 text-[#0FA698]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-black text-lg text-[#173B67] leading-none">
                      Skill<span className="text-[#0FA698]">Connect</span>
                    </span>
                    <span className="text-[10px] text-[#667085] font-medium leading-tight mt-0.5">
                      Trusted Local Services
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close navigation menu"
                  className="p-2 -mr-2 rounded-full text-[#667085] hover:text-[#173B67] hover:bg-[#F7F9FC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0FA698]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Active User Quick Role Switcher */}
              <div className="mt-4 p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF1]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                    Demo Persona: {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7F7F4] text-[#087F75] capitalize">
                    {role}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => switchRole('customer')}
                    className={`py-1.5 text-center rounded-xl text-xs font-bold transition-all ${
                      role === 'customer'
                        ? 'bg-[#173B67] text-white shadow-2xs'
                        : 'bg-white text-[#173B67] border border-[#E4EAF1] hover:bg-slate-50'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => switchRole('worker')}
                    className={`py-1.5 text-center rounded-xl text-xs font-bold transition-all ${
                      role === 'worker'
                        ? 'bg-[#0FA698] text-white shadow-2xs'
                        : 'bg-white text-[#173B67] border border-[#E4EAF1] hover:bg-slate-50'
                    }`}
                  >
                    Worker
                  </button>
                  <button
                    type="button"
                    onClick={() => switchRole('admin')}
                    className={`py-1.5 text-center rounded-xl text-xs font-bold transition-all ${
                      role === 'admin'
                        ? 'bg-[#173B67] text-white shadow-2xs'
                        : 'bg-white text-[#173B67] border border-[#E4EAF1] hover:bg-slate-50'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <nav aria-label="Mobile navigation" className="mt-5 flex flex-col gap-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      aria-current={item.isActive ? 'page' : undefined}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        item.isActive
                          ? 'bg-[#E7F7F4] text-[#087F75] font-bold shadow-2xs'
                          : 'text-[#173B67] hover:bg-[#F7F9FC] hover:text-[#0FA698]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${item.isActive ? 'text-[#087F75]' : 'text-[#0FA698]'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Primary Actions */}
              <div className="mt-6 pt-5 border-t border-[#E4EAF1] flex flex-col gap-2.5">
                <Link
                  href={
                    role === 'worker'
                      ? '/worker/dashboard'
                      : role === 'admin'
                      ? '/admin'
                      : '/register?role=worker'
                  }
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0FA698] hover:bg-[#087F75] text-white font-bold text-sm py-3 px-4 rounded-full shadow-xs transition-all active:scale-[0.98]"
                >
                  <span>
                    {role === 'worker'
                      ? 'Pro Dashboard'
                      : role === 'admin'
                      ? 'Admin Portal'
                      : 'Join as a Pro'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-[#B42318] hover:bg-red-50 rounded-xl transition-colors text-center"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Bottom Verification Footer */}
            <div className="mt-6 pt-4 border-t border-[#E4EAF1]">
              <div className="flex items-start gap-2 p-3 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF1] text-[11px] text-[#667085] leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-[#0FA698] shrink-0 mt-0.5" />
                <span>Verified trade licenses, upfront diagnostic fees &amp; escrow milestone protection.</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
