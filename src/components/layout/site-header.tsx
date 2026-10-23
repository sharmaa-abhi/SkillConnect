'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Wrench,
  ArrowRight,
  ShieldCheck,
  Menu,
  User,
  LogOut,
  ChevronDown,
  Calendar,
  CreditCard,
  Lock,
} from 'lucide-react';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useAuth } from '@/context/auth-context';

export function SiteHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, role, switchRole, logout } = useAuth();
  const pathname = usePathname();

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [userDropdownOpen]);

  const navItems = [
    {
      label: 'All Services',
      href: '/services',
      isActive: pathname === '/services' || pathname.startsWith('/services/'),
    },
    {
      label: 'Find Professionals',
      href: '/professionals',
      isActive: pathname.startsWith('/professionals'),
    },
    {
      label: 'How It Works',
      href: '/trust',
      isActive: pathname === '/trust' || pathname === '/how-it-works',
    },
    {
      label: 'Customer Portal',
      href: '/customer/dashboard',
      isActive: pathname.startsWith('/customer'),
    },
    {
      label: 'Pro Portal',
      href: '/worker/dashboard',
      isActive: pathname.startsWith('/worker'),
    },
    {
      label: 'Admin Desk',
      href: '/admin',
      isActive: pathname.startsWith('/admin'),
    },
  ];

  return (
    <>
      {/* Modern Floating Navbar Container */}
      <header className="sticky top-2 sm:top-4 lg:top-5 z-40 w-full px-2.5 sm:px-6 lg:px-8 transition-all duration-300 pointer-events-none">
        <div className="pointer-events-auto max-w-[1440px] mx-auto bg-white/95 backdrop-blur-md border border-[#E5E7EB] shadow-[0_10px_35px_-8px_rgba(11,15,14,0.08),0_2px_8px_-2px_rgba(11,15,14,0.04)] rounded-2xl sm:rounded-full px-2.5 sm:px-4 lg:px-5 py-2.5 sm:py-3.5 flex items-center justify-between min-h-[62px] sm:min-h-[76px] transition-all">
          {/* Brand Section */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-2xl"
            aria-label="SkillConnect Home"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#0B0F0E] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-all shrink-0">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-[#16A34A]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg sm:text-xl lg:text-[22px] font-black tracking-tight text-[#0B0F0E] leading-none">
                Skill<span className="text-[#16A34A]">Connect</span>
              </span>
              <span className="text-[11px] text-[#4B5563] font-medium tracking-normal leading-tight mt-1 hidden md:block">
                Trusted Local Service Professionals
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex flex-1 min-w-0 justify-center items-center gap-0 xl:gap-0.5"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.isActive ? 'page' : undefined}
                className={`px-2 xl:px-2.5 py-2 rounded-full text-[12px] xl:text-[13px] font-semibold transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-1 ${
                  item.isActive
                    ? 'bg-[#F0FDF4] text-[#16A34A] font-bold shadow-2xs'
                    : 'text-[#111827] hover:text-[#16A34A] hover:bg-[#F8FAFC]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Section: User Profile & CTA */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Authenticated User Menu Pill */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
                aria-haspopup="menu"
                aria-label={`User account menu for ${user.name}`}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full border border-[#E5E7EB] bg-[#F8FAFC] hover:bg-white hover:border-[#D1D5DB] transition-all text-left shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#0B0F0E] text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 border border-white/60 shadow-xs">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name[0]
                  )}
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-[#0B0F0E] line-clamp-1 max-w-[72px] xl:max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[#16A34A] font-semibold capitalize">
                    {role === 'worker' ? 'Pro Worker' : role}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#4B5563] transition-transform duration-200 ${
                    userDropdownOpen ? 'rotate-180 text-[#16A34A]' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  role="menu"
                  aria-label="User account actions"
                  className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-white border border-[#E5E7EB] shadow-[0_12px_32px_-4px_rgba(11,15,14,0.12)] p-2.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="p-2.5 border-b border-[#E5E7EB] mb-1.5 bg-[#F8FAFC] rounded-xl">
                    <p className="font-bold text-[#0B0F0E] text-sm">{user.name}</p>
                    <p className="text-[11px] text-[#4B5563] truncate">{user.email}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] capitalize">
                        Role: {role}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/customer/dashboard"
                    role="menuitem"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-[#111827] hover:bg-[#F8FAFC] transition-colors font-medium"
                  >
                    <User className="w-4 h-4 text-[#2563EB]" />
                    <span>Customer Dashboard</span>
                  </Link>

                  <Link
                    href="/booking"
                    role="menuitem"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-[#111827] hover:bg-[#F8FAFC] transition-colors font-medium"
                  >
                    <Calendar className="w-4 h-4 text-[#16A34A]" />
                    <span>Booking History</span>
                  </Link>

                  <Link
                    href="/payments"
                    role="menuitem"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-[#111827] hover:bg-[#F8FAFC] transition-colors font-medium"
                  >
                    <Lock className="w-4 h-4 text-[#2563EB]" />
                    <span>Escrow Ledger &amp; Payments</span>
                  </Link>

                  <Link
                    href="/worker/dashboard"
                    role="menuitem"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-[#111827] hover:bg-[#F8FAFC] transition-colors font-medium"
                  >
                    <Wrench className="w-4 h-4 text-[#16A34A]" />
                    <span>Pro Dispatch Portal</span>
                  </Link>

                  <Link
                    href="/admin"
                    role="menuitem"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-[#111827] hover:bg-[#F8FAFC] transition-colors font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                    <span>Admin Operations Desk</span>
                  </Link>

                  <div className="my-1.5 border-t border-[#E5E7EB]" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-[#DC2626] hover:bg-red-50 transition-colors text-left font-medium cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Primary Call-to-Action Pill */}
            <Link
              href={
                role === 'worker'
                  ? '/worker/dashboard'
                  : role === 'admin'
                  ? '/admin'
                  : '/register?role=worker'
              }
              className="inline-flex items-center justify-center gap-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-[13px] px-3.5 py-2.5 rounded-full shadow-xs hover:shadow-md active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 shrink-0 group cursor-pointer"
            >
              <span>
                {role === 'worker'
                  ? 'Pro Dashboard'
                  : role === 'admin'
                  ? 'Admin Portal'
                  : 'Join as a Pro'}
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile & Tablet Controls */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => switchRole(role === 'customer' ? 'worker' : role === 'worker' ? 'admin' : 'customer')}
              className="text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-1.5 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/30 transition-colors whitespace-nowrap active:scale-95 cursor-pointer"
              aria-label={`Switch demo role. Currently active role is ${role}`}
              title="Tap to switch persona role"
            >
              <span className="capitalize">{role}</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label="Open navigation menu"
              className="p-2 sm:p-2.5 rounded-xl sm:rounded-full text-[#111827] bg-[#F8FAFC] hover:bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] shrink-0 active:scale-95 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile & Tablet Nav */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
