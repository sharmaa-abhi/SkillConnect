'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Banknote,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBookings } from '@/lib/demo-storage';
import { useAuth } from '@/context/auth-context';
import { formatCurrency } from '@/lib/formatters';
import { DemoBooking } from '@/types/booking';
import { PrototypeDisclaimer } from '@/components/ui/prototype-disclaimer';

type PaymentStatusKey = NonNullable<DemoBooking['paymentStatus']>;

const paymentStatusConfig: Record<
  PaymentStatusKey,
  { label: string; variant: 'success' | 'warning' | 'error' | 'pending' | 'neutral'; description: string }
> = {
  authorized_hold: {
    label: 'Authorized Escrow Hold',
    variant: 'warning',
    description: 'Pre-authorized diagnostic fee held securely in escrow pending service completion.',
  },
  released_to_worker: {
    label: 'Released to Professional',
    variant: 'success',
    description: 'Service completed and customer sign-off recorded. Escrow released to technician.',
  },
  refunded_to_customer: {
    label: 'Refunded to Customer',
    variant: 'neutral',
    description: 'Appointment cancelled or declined. Pre-authorization hold refunded in full to customer.',
  },
  disputed_hold: {
    label: 'Disputed (Locked in Escrow)',
    variant: 'error',
    description: 'Dispute submitted. Escrow funds locked pending Operations Desk mediation.',
  },
};

export default function PaymentsPage() {
  const bookings = useBookings();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Financial Ledger Computations
  const financialSummary = useMemo(() => {
    let totalAuthorizedHold = 0;
    let totalReleased = 0;
    let totalRefunded = 0;

    bookings.forEach((b) => {
      if (b.paymentStatus === 'authorized_hold' || b.paymentStatus === 'disputed_hold') {
        totalAuthorizedHold += b.diagnosticFee;
      } else if (b.paymentStatus === 'released_to_worker') {
        totalReleased += b.totalEstimateLow;
      } else if (b.paymentStatus === 'refunded_to_customer') {
        totalRefunded += b.diagnosticFee;
      }
    });

    return {
      totalAuthorizedHold,
      totalReleased,
      totalRefunded,
      totalTransactions: bookings.length,
    };
  }, [bookings]);

  // Filtered Bookings for the Ledger
  const filteredBookings = useMemo(() => {
    let result = bookings;
    if (filterStatus !== 'all') {
      result = result.filter((b) => b.paymentStatus === filterStatus);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.professionalName.toLowerCase().includes(q) ||
          b.categoryName.toLowerCase().includes(q) ||
          b.serviceDescription.toLowerCase().includes(q)
      );
    }
    return result;
  }, [bookings, filterStatus, searchQuery]);

  return (
    <div className="py-10 sm:py-16 bg-[#F8FAFC] min-h-screen text-[#111827]">
      <Container>
        {/* Prototype Disclaimer */}
        <div className="mb-6">
          <PrototypeDisclaimer variant="banner" className="rounded-2xl" />
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#2563EB]/20 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Escrow Financial Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#0B0F0E] tracking-tight">
              Payments &amp; Escrow Security
            </h1>
            <p className="text-sm text-[#4B5563] mt-2 max-w-2xl leading-relaxed">
              Transparent, real-time ledger of pre-authorized diagnostic holds, releases to professionals, and customer refunds protected by our escrow guarantee.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/checkout">
              <Button variant="outline" size="md" leftIcon={<CreditCard className="w-4 h-4 text-[#2563EB]" />}>
                Payment Process
              </Button>
            </Link>
            <Link href="/booking">
              <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                All Bookings
              </Button>
            </Link>
          </div>
        </div>

        {/* Financial Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center justify-between text-[#4B5563] text-xs font-semibold mb-2">
              <span>Active Escrow Holds</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#0B0F0E]">
              {formatCurrency(financialSummary.totalAuthorizedHold)}
            </div>
            <span className="text-[11px] text-[#4B5563] mt-1 block">
              Safely held pending completion
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center justify-between text-[#4B5563] text-xs font-semibold mb-2">
              <span>Total Funds Released</span>
              <div className="w-8 h-8 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#16A34A]">
              {formatCurrency(financialSummary.totalReleased)}
            </div>
            <span className="text-[11px] text-[#4B5563] mt-1 block">
              Released upon customer sign-off
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center justify-between text-[#4B5563] text-xs font-semibold mb-2">
              <span>Customer Refunds</span>
              <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <RefreshCw className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#2563EB]">
              {formatCurrency(financialSummary.totalRefunded)}
            </div>
            <span className="text-[11px] text-[#4B5563] mt-1 block">
              Returned on cancellation or decline
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center justify-between text-[#4B5563] text-xs font-semibold mb-2">
              <span>Workmanship Guarantee</span>
              <div className="w-8 h-8 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#0B0F0E]">$2,500</div>
            <span className="text-[11px] text-[#16A34A] font-semibold mt-1 block">
              Standard on every booking
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#4B5563] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions by reference, pro, or service..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] text-sm rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#16A34A] text-[#111827] transition-all"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Transactions' },
              { id: 'authorized_hold', label: 'Holds' },
              { id: 'released_to_worker', label: 'Released' },
              { id: 'refunded_to_customer', label: 'Refunded' },
              { id: 'disputed_hold', label: 'Disputes' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  filterStatus === tab.id
                    ? 'bg-[#0B0F0E] text-white shadow-xs'
                    : 'bg-[#F8FAFC] text-[#4B5563] hover:text-[#111827] hover:bg-[#E5E7EB]/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Ledger */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden mb-12">
          <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0B0F0E]">
              Transaction Records ({filteredBookings.length})
            </h2>
            <span className="text-xs text-[#4B5563]">
              Deterministic escrow transitions
            </span>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-[#4B5563]">
              <Banknote className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#111827]">No payment transactions found</p>
              <p className="text-xs text-[#4B5563] mt-1">
                Try adjusting your search query or status filter.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E7EB] overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-xs uppercase font-bold text-[#4B5563] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Reference &amp; Service</th>
                    <th className="px-5 py-3.5">Professional</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Diagnostic Hold</th>
                    <th className="px-5 py-3.5">Total Scope</th>
                    <th className="px-5 py-3.5">Escrow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredBookings.map((b) => {
                    const statusInfo = (b.paymentStatus && paymentStatusConfig[b.paymentStatus]) || {
                      label: b.paymentStatus || 'Pending',
                      variant: 'neutral' as const,
                      description: 'Status update pending.',
                    };

                    return (
                      <tr key={b.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-mono text-xs font-bold text-[#2563EB]">
                            {b.id}
                          </div>
                          <div className="font-semibold text-[#0B0F0E] mt-0.5">
                            {b.serviceDescription}
                          </div>
                          <span className="text-xs text-[#4B5563]">{b.categoryName}</span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-semibold text-[#0B0F0E]">
                            {b.professionalName}
                          </div>
                          <span className="text-xs text-[#4B5563]">
                            {b.professionalTrade}
                          </span>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap text-xs text-[#4B5563]">
                          <div>{b.appointmentDate}</div>
                          <div className="text-[11px] text-[#9CA3AF]">{b.appointmentTime}</div>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="font-bold text-[#0B0F0E]">
                            {formatCurrency(b.diagnosticFee)}
                          </span>
                          <span className="text-[11px] text-[#16A34A] block">
                            100% credited
                          </span>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="font-semibold text-[#0B0F0E]">
                            {formatCurrency(b.totalEstimateLow)} – {formatCurrency(b.totalEstimateHigh)}
                          </span>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <Badge variant={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
                          <span className="text-[11px] text-[#4B5563] block mt-1 max-w-xs truncate" title={statusInfo.description}>
                            {statusInfo.description}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Escrow Guarantee Architecture Callout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B0F0E]">Milestone Pre-Authorization</h3>
              <p className="text-xs text-[#4B5563] mt-1.5 leading-relaxed">
                Funds are held in neutral escrow when booking is confirmed. Professionals receive payment only after satisfactory on-site completion.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B0F0E]">Guaranteed Full Refund</h3>
              <p className="text-xs text-[#4B5563] mt-1.5 leading-relaxed">
                If a professional declines or you cancel prior to work, escrow authorization holds are released back to your payment card immediately.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B0F0E]">Admin Operations Mediation</h3>
              <p className="text-xs text-[#4B5563] mt-1.5 leading-relaxed">
                In case of dispute, funds are locked in escrow. Our Operations Desk investigates documentation and verifies state compliance before release.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
