'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Users, ShieldCheck, Briefcase, LayoutDashboard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
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
              <div className="flex items-center justify-between pb-6 border-b border-[#e3e8e3]">
                <Link href="/" onClick={onClose} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#143d35] flex items-center justify-center text-white font-bold text-base">
                    S
                  </div>
                  <span className="font-bold text-lg text-[#172522]">SkillConnect</span>
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close navigation menu"
                  className="p-2 -mr-2 rounded-lg text-[#66716d] hover:text-[#172522] hover:bg-[#f8f8f4]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="mt-6 flex flex-col gap-2">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#172522] hover:bg-[#e7f4ed] hover:text-[#143d35] transition-colors"
                    >
                      <Icon className="w-4 h-4 text-[#237a63]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t border-[#e3e8e3] flex flex-col gap-3">
                <Link href="/login" onClick={onClose}>
                  <Button variant="outline" className="w-full justify-center">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register?role=worker" onClick={onClose}>
                  <Button variant="primary" className="w-full justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Join as a Pro
                  </Button>
                </Link>
              </div>
            </div>

            {/* Prototype notice badge */}
            <div className="mt-8 pt-4 border-t border-[#e3e8e3]">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-[#f8f8f4] border border-[#e3e8e3] text-xs text-[#66716d]">
                <ShieldCheck className="w-4 h-4 text-[#237a63] flex-shrink-0 mt-0.5" />
                <span>Phase 1 Interactive Prototype. Verified trade UI demo.</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
