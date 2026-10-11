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
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useAuth } from '@/context/auth-context';

export function SiteHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, role, switchRole, logout } = useAuth();
  const pathname = usePathname();

  return (
    <>
      {/* Top Demo & Role Switcher Bar */}
      <div className="bg-[#173B67] text-white text-xs py-2 px-4 border-b border-white/10">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full bg-[#0F9D91] text-white text-[10px] tracking-wide uppercase">
              <ShieldCheck className="w-3 h-3" />
              Verified Marketplace
            </span>
            <span className="hidden sm:inline text-white/90">
              Upfront diagnostic pricing • Multi-tier contractor verification • Escrow milestone protection
            </span>
            <span className="sm:hidden text-white/90">Upfront pricing & escrow</span>
          </div>

          {/* Quick Role Switcher Pill */}
          <div className="flex items-center gap-2 text-[11px]">
            <span className="hidden md:inline text-white/70">Role Switcher:</span>
            <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/15">
              <button
                type="button"
                onClick={() => switchRole('customer')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  role === 'customer'
                    ? 'bg-[#0F9D91] text-white shadow-2xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => switchRole('worker')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  role === 'worker'
                    ? 'bg-[#0F9D91] text-white shadow-2xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Pro Worker
              </button>
              <button
                type="button"
                onClick={() => switchRole('admin')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  role === 'admin'
                    ? 'bg-[#0F9D91] text-white shadow-2xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E4E7EC] transition-all">
        <Container className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Branding */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#173B67] flex items-center justify-center text-white shadow-xs group-hover:bg-[#0F2A4A] transition-colors">
              <Wrench className="w-5 h-5 text-[#0F9D91]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#173B67]">
                Skill<span className="text-[#0F9D91]">Connect</span>
              </span>
              <span className="text-[10px] text-[#667085] -mt-1 tracking-wider uppercase font-semibold">
                Verified Local Services
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              href="/services"
              className={`text-sm font-semibold transition-colors ${
                pathname === '/services'
                  ? 'text-[#173B67]'
                  : 'text-[#263445] hover:text-[#173B67]'
              }`}
            >
              All Services
            </Link>
            <Link
              href="/professionals"
              className={`text-sm font-semibold transition-colors ${
                pathname.startsWith('/professionals')
                  ? 'text-[#173B67]'
                  : 'text-[#263445] hover:text-[#173B67]'
              }`}
            >
              Find Professionals
            </Link>
            <Link
              href="/customer/dashboard"
              className={`text-sm font-semibold transition-colors ${
                pathname === '/customer/dashboard'
                  ? 'text-[#173B67]'
                  : 'text-[#667085] hover:text-[#173B67]'
              }`}
            >
              Customer Portal
            </Link>
            <Link
              href="/worker/dashboard"
              className={`text-sm font-semibold transition-colors ${
                pathname === '/worker/dashboard'
                  ? 'text-[#173B67]'
                  : 'text-[#667085] hover:text-[#173B67]'
              }`}
            >
              Pro Portal
            </Link>
            <Link
              href="/admin"
              className={`text-sm font-semibold transition-colors ${
                pathname.startsWith('/admin')
                  ? 'text-[#173B67]'
                  : 'text-[#667085] hover:text-[#173B67]'
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
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-[#E4E7EC] hover:bg-[#F7F8FA] transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full bg-[#173B67] text-white flex items-center justify-center font-bold text-xs overflow-hidden">
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
                className="font-bold shadow-2xs"
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
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#EBF1F8] text-[#173B67] border border-[#E4E7EC]"
            >
              Role: {role}
            </button>
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 rounded-xl text-[#263445] hover:bg-[#F7F8FA] border border-[#E4E7EC] transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </Container>
      </header>

      {/* Slide-out Mobile Nav */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
