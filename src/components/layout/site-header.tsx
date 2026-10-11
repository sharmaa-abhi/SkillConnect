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
      isActive: pathname === '/services',
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
      label: 'Admin Trust',
      href: '/admin',
      isActive: pathname.startsWith('/admin'),
    },
  ];

  return (
    <>
      {/* Modern Floating Navbar Container */}
      <header className="sticky top-4 sm:top-5 z-40 w-full px-4 sm:px-6 lg:px-8 transition-all duration-300 pointer-events-none">
        <div className="pointer-events-auto max-w-[1440px] mx-auto bg-white/95 backdrop-blur-md border border-[#E4EAF1] shadow-[0_10px_35px_-8px_rgba(23,59,103,0.08),0_2px_8px_-2px_rgba(23,59,103,0.04)] rounded-[28px] sm:rounded-full px-3 sm:px-4 lg:px-5 py-3 sm:py-3.5 flex items-center justify-between min-h-[76px] transition-all">
          {/* Brand Section */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0FA698] rounded-2xl"
            aria-label="SkillConnect Home"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#173B67] flex items-center justify-center text-white shadow-xs group-hover:bg-[#0F2A4A] group-hover:scale-105 transition-all shrink-0">
              <Wrench className="w-5 h-5 text-[#0FA698]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl sm:text-[22px] font-black tracking-tight text-[#173B67] leading-none">
                Skill<span className="text-[#0FA698]">Connect</span>
              </span>
              <span className="text-xs text-[#667085] font-medium tracking-normal leading-tight mt-1 hidden sm:block">
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
                className={`px-2 xl:px-2.5 py-2 rounded-full text-[12px] xl:text-[13px] font-semibold transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0FA698] focus-visible:ring-offset-1 ${
                  item.isActive
                    ? 'bg-[#E7F7F4] text-[#087F75] font-bold shadow-2xs'
                    : 'text-[#173B67] hover:text-[#0FA698] hover:bg-[#F7F9FC]'
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
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full border border-[#E4EAF1] bg-[#F7F9FC] hover:bg-white hover:border-[#D0D9E4] transition-all text-left shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0FA698] focus-visible:ring-offset-2"
              >
                <div className="w-8 h-8 rounded-full bg-[#173B67] text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 border border-white/60 shadow-xs">
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
                  <span className="text-xs font-bold text-[#173B67] line-clamp-1 max-w-[72px] xl:max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[#0FA698] font-semibold capitalize">
                    {role === 'worker' ? 'Pro Worker' : role}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#667085] transition-transform duration-200 ${
                    userDropdownOpen ? 'rotate-180 text-[#0FA698]' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  role="menu"
                  aria-label="User account actions"
                  className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-white border border-[#E4EAF1] shadow-[0_12px_32px_-4px_rgba(23,59,103,0.12)] p-2.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="p-2.5 border-b border-[#E4EAF1] mb-1.5 bg-[#F7F9FC] rounded-xl">
                    <p className="font-bold text-[#173B67] text-sm">{user.name}</p>
                    <p className="text-[11px] text-[#667085] truncate">{user.email}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7F7F4] text-[#087F75] capitalize">
                        Role: {role}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/customer/dashboard"
                    role="menuitem"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-[#173B67] hover:bg-[#F7F9FC] transition-colors font-medium"
                  >
                    <User className="w-4 h-4 text-[#173B67]" />
                    <span>Customer Appointments</span>
                  </Link>

                  <Link
                    href="/worker/dashboard"
                    role="menuitem"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-[#173B67] hover:bg-[#F7F9FC] transition-colors font-medium"
                  >
                    <Wrench className="w-4 h-4 text-[#0FA698]" />
                    <span>Pro Dispatch Portal</span>
                  </Link>

                  <Link
                    href="/admin"
                    role="menuitem"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-[#173B67] hover:bg-[#F7F9FC] transition-colors font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#173B67]" />
                    <span>Admin Verification Desk</span>
                  </Link>

                  <div className="my-1.5 border-t border-[#E4EAF1]" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-[#B42318] hover:bg-red-50 transition-colors text-left font-medium"
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
              className="inline-flex items-center justify-center gap-1.5 bg-[#0FA698] hover:bg-[#087F75] text-white font-bold text-[13px] px-3.5 py-2.5 rounded-full shadow-xs hover:shadow-md active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0FA698] focus-visible:ring-offset-2 shrink-0 group"
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
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => switchRole(role === 'customer' ? 'worker' : 'customer')}
              className="text-[11px] font-bold px-2.5 py-1.5 rounded-full bg-[#E7F7F4] text-[#087F75] border border-[#0FA698]/20 transition-colors"
              aria-label={`Toggle demo role. Current role is ${role}`}
            >
              Role: {role}
            </button>
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label="Open navigation menu"
              className="p-2.5 rounded-full text-[#173B67] bg-[#F7F9FC] hover:bg-white border border-[#E4EAF1] hover:border-[#D0D9E4] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0FA698]"
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
