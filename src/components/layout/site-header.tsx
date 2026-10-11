'use client';

import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useAuth } from '@/context/auth-context';

export function SiteHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, role, switchRole, logout } = useAuth();
  const pathname = usePathname();

  return (
    <>
      {/* Floating Navbar */}
      <header className="sticky top-3 sm:top-4 z-40 w-full px-3 sm:px-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md border border-[#E4E7EC]/90 shadow-[0_8px_30px_rgb(0,0,0,0.07)] rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all">
          {/* Logo Branding */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-full bg-[#173B67] flex items-center justify-center text-white shadow-xs group-hover:bg-[#0F2A4A] transition-colors shrink-0">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F9D91]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#173B67] leading-tight">
                Skill<span className="text-[#0F9D91]">Connect</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#667085] tracking-wider uppercase font-semibold leading-none">
                Verified Local Services
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/services"
              className={`px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all ${
                pathname === '/services'
                  ? 'bg-[#173B67] text-white shadow-xs'
                  : 'text-[#263445] hover:text-[#173B67] hover:bg-[#F7F8FA]'
              }`}
            >
              All Services
            </Link>
            <Link
              href="/professionals"
              className={`px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all ${
                pathname.startsWith('/professionals')
                  ? 'bg-[#173B67] text-white shadow-xs'
                  : 'text-[#263445] hover:text-[#173B67] hover:bg-[#F7F8FA]'
              }`}
            >
              Find Professionals
            </Link>
            <Link
              href="/trust"
              className={`px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all ${
                pathname === '/trust' || pathname === '/how-it-works'
                  ? 'bg-[#173B67] text-white shadow-xs'
                  : 'text-[#263445] hover:text-[#173B67] hover:bg-[#F7F8FA]'
              }`}
            >
              How It Works &amp; Trust
            </Link>
            <Link
              href="/customer/dashboard"
              className={`px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all ${
                pathname === '/customer/dashboard'
                  ? 'bg-[#173B67] text-white shadow-xs'
                  : 'text-[#667085] hover:text-[#173B67] hover:bg-[#F7F8FA]'
              }`}
            >
              Customer Portal
            </Link>
            <Link
              href="/worker/dashboard"
              className={`px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all ${
                pathname === '/worker/dashboard'
                  ? 'bg-[#173B67] text-white shadow-xs'
                  : 'text-[#667085] hover:text-[#173B67] hover:bg-[#F7F8FA]'
              }`}
            >
              Pro Portal
            </Link>
            <Link
              href="/admin"
              className={`px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all ${
                pathname.startsWith('/admin')
                  ? 'bg-[#173B67] text-white shadow-xs'
                  : 'text-[#667085] hover:text-[#173B67] hover:bg-[#F7F8FA]'
              }`}
            >
              Admin Trust
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Active User Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1 pr-3 rounded-full border border-[#E4E7EC] hover:bg-[#F7F8FA] transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full bg-[#173B67] text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name[0]
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#263445] leading-tight line-clamp-1">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[#0F9D91] font-semibold capitalize leading-none">
                    {role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E4E7EC] shadow-xl p-2 z-50 text-xs"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="p-2 border-b border-[#E4E7EC] mb-1">
                    <p className="font-bold text-[#263445]">{user.name}</p>
                    <p className="text-[11px] text-[#667085] truncate">{user.email}</p>
                    <span className="mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EBF1F8] text-[#173B67] capitalize">
                      Active Role: {role}
                    </span>
                  </div>

                  <Link
                    href="/customer/dashboard"
                    className="flex items-center gap-2 p-2 rounded-xl text-[#263445] hover:bg-[#F7F8FA]"
                  >
                    <User className="w-4 h-4 text-[#173B67]" />
                    <span>Customer Appointments</span>
                  </Link>

                  <Link
                    href="/worker/dashboard"
                    className="flex items-center gap-2 p-2 rounded-xl text-[#263445] hover:bg-[#F7F8FA]"
                  >
                    <Wrench className="w-4 h-4 text-[#0F9D91]" />
                    <span>Pro Dispatch Portal</span>
                  </Link>

                  <Link
                    href="/admin"
                    className="flex items-center gap-2 p-2 rounded-xl text-[#263445] hover:bg-[#F7F8FA]"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#173B67]" />
                    <span>Admin Verification Desk</span>
                  </Link>

                  <div className="my-1 border-t border-[#E4E7EC]" />

                  <button
                    type="button"
                    onClick={logout}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-[#B42318] hover:bg-red-50 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            <Link href="/register?role=worker">
              <Button
                variant="secondary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold rounded-full shadow-2xs"
              >
                Join as a Pro
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => switchRole(role === 'customer' ? 'worker' : 'customer')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EBF1F8] text-[#173B67] border border-[#E4E7EC]"
            >
              Role: {role}
            </button>
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 rounded-full text-[#263445] hover:bg-[#F7F8FA] border border-[#E4E7EC] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Nav */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
