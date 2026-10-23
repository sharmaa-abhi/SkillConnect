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
  Calendar,
  Lock,
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
      isActive: pathname === '/services' || pathname.startsWith('/services/'),
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
      label: 'Booking History',
      href: '/booking',
      icon: Calendar,
      isActive: pathname === '/booking',
    },
    {
      label: 'Payments & Escrow',
      href: '/payments',
      icon: Lock,
      isActive: pathname === '/payments' || pathname === '/checkout',
    },
    {
      label: 'Pro Portal',
      href: '/worker/dashboard',
      icon: Briefcase,
      isActive: pathname.startsWith('/worker'),
    },
    {
      label: 'Admin Desk',
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
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Slide-out Drawer from Right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-[88vw] max-w-xs sm:max-w-sm bg-white shadow-2xl p-4 sm:p-6 flex flex-col justify-between overflow-y-auto border-l border-[#E5E7EB]"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-[#E5E7EB]">
                <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0B0F0E] flex items-center justify-center text-white font-bold shrink-0">
                    <Wrench className="w-4 h-4 text-[#16A34A]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-black text-lg text-[#0B0F0E] leading-none">
                      Skill<span className="text-[#16A34A]">Connect</span>
                    </span>
                    <span className="text-[10px] text-[#4B5563] font-medium leading-tight mt-0.5">
                      Trusted Local Services
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close navigation menu"
                  className="p-2 -mr-1 rounded-full text-[#4B5563] hover:text-[#0B0F0E] hover:bg-[#F8FAFC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Active User Quick Role Switcher */}
              <div className="mt-3.5 sm:mt-4 p-3 sm:p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#4B5563] uppercase tracking-wider truncate mr-1">
                    Demo: {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] capitalize shrink-0">
                    {role}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => switchRole('customer')}
                    className={`py-2 text-center rounded-xl text-xs font-bold transition-all min-h-[38px] cursor-pointer ${
                      role === 'customer'
                        ? 'bg-[#0B0F0E] text-white shadow-2xs'
                        : 'bg-white text-[#111827] border border-[#E5E7EB] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => switchRole('worker')}
                    className={`py-2 text-center rounded-xl text-xs font-bold transition-all min-h-[38px] cursor-pointer ${
                      role === 'worker'
                        ? 'bg-[#16A34A] text-white shadow-2xs'
                        : 'bg-white text-[#111827] border border-[#E5E7EB] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    Worker
                  </button>
                  <button
                    type="button"
                    onClick={() => switchRole('admin')}
                    className={`py-2 text-center rounded-xl text-xs font-bold transition-all min-h-[38px] cursor-pointer ${
                      role === 'admin'
                        ? 'bg-[#2563EB] text-white shadow-2xs'
                        : 'bg-white text-[#111827] border border-[#E5E7EB] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <nav aria-label="Mobile navigation" className="mt-4 sm:mt-5 flex flex-col gap-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      aria-current={item.isActive ? 'page' : undefined}
                      className={`flex items-center gap-3 px-3.5 py-2.5 sm:py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                        item.isActive
                          ? 'bg-[#F0FDF4] text-[#16A34A] font-bold shadow-2xs'
                          : 'text-[#111827] hover:bg-[#F8FAFC] hover:text-[#16A34A]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${item.isActive ? 'text-[#16A34A]' : 'text-[#4B5563]'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Primary Actions */}
              <div className="mt-6 pt-5 border-t border-[#E5E7EB] flex flex-col gap-2.5">
                <Link
                  href={
                    role === 'worker'
                      ? '/worker/dashboard'
                      : role === 'admin'
                      ? '/admin'
                      : '/register?role=worker'
                  }
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm py-3 px-4 rounded-full shadow-xs transition-all active:scale-[0.98] cursor-pointer"
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
                  className="w-full py-2.5 text-xs font-semibold text-[#DC2626] hover:bg-red-50 rounded-xl transition-colors text-center cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Bottom Verification Footer */}
            <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
              <div className="flex items-start gap-2 p-3 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] text-[11px] text-[#4B5563] leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>Verified trade licenses, upfront diagnostic fees &amp; escrow milestone protection.</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
