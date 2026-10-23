'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  ChevronRight,
  MapPin,
  Search,
  Filter,
  AlertCircle,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { useBookings } from '@/lib/demo-storage';
import { useAuth } from '@/context/auth-context';
import { formatCurrency } from '@/lib/formatters';
import { DemoBooking } from '@/types/booking';
import { PrototypeDisclaimer } from '@/components/ui/prototype-disclaimer';

const statusConfig: Record<DemoBooking['status'], { label: string; variant: 'success' | 'warning' | 'error' | 'pending' | 'neutral' }> = {
  pending: { label: 'Pending Confirmation', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'success' },
  in_progress: { label: 'In Progress', variant: 'pending' },
  completed: { label: 'Completed', variant: 'success' },
  declined: { label: 'Declined', variant: 'error' },
  cancelled: { label: 'Cancelled', variant: 'neutral' },
  disputed: { label: 'Disputed', variant: 'error' },
};

export default function BookingPage() {
  const bookings = useBookings();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = useMemo(() => {
    let result = bookings;
    if (filterStatus !== 'all') {
      result = result.filter((b) => b.status === filterStatus);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.professionalName.toLowerCase().includes(q) ||
          b.categoryName.toLowerCase().includes(q) ||
          b.serviceDescription.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [bookings, filterStatus, searchQuery]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: bookings.length };
    bookings.forEach((b) => {
      counts[b.status] = (counts[b.status] || 0) + 1;
    });
    return counts;
  }, [bookings]);

  return (
    <div className="py-10 sm:py-16 bg-white min-h-screen">
      <Container>
        {/* Disclaimer */}
        <div className="mb-6">
          <PrototypeDisclaimer variant="banner" className="rounded-2xl" />
        </div>

        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
            Booking History
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B0F0E] mt-1 tracking-tight">
            Your Service Bookings
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Track appointments, view payment status, and manage your service requests.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#F8FAFC] p-3 sm:p-4 rounded-2xl border border-[#E5E7EB] mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings by pro, service, or ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-white text-sm rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#16A34A] text-[#0B0F0E] transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#6B7280] shrink-0" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-[#E5E7EB] text-xs font-bold text-[#0B0F0E] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#16A34A] cursor-pointer"
            >
              <option value="all">All Bookings ({statusCounts.all || 0})</option>
              <option value="pending">Pending ({statusCounts.pending || 0})</option>
              <option value="confirmed">Confirmed ({statusCounts.confirmed || 0})</option>
              <option value="in_progress">In Progress ({statusCounts.in_progress || 0})</option>
              <option value="completed">Completed ({statusCounts.completed || 0})</option>
              <option value="cancelled">Cancelled ({statusCounts.cancelled || 0})</option>
              <option value="declined">Declined ({statusCounts.declined || 0})</option>
              <option value="disputed">Disputed ({statusCounts.disputed || 0})</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const config = statusConfig[booking.status];
              return (
                <div
                  key={booking.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#D1D5DB] transition-all"
                >
                  {/* Top Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={booking.professionalAvatar}
                        alt={booking.professionalName}
                        className="w-11 h-11 rounded-xl object-cover border border-[#E5E7EB]"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-[#0B0F0E]">
                          {booking.professionalName}
                        </h3>
                        <p className="text-[11px] text-[#6B7280]">{booking.professionalTrade}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={config.variant} size="md">
                        {config.label}
                      </Badge>
                      <span className="text-[11px] text-[#6B7280] font-mono">{booking.id}</span>
                    </div>
                  </div>

                  {/* Service Description */}
                  <p className="text-sm text-[#0B0F0E] mb-3">{booking.serviceDescription}</p>

                  {/* Details Row */}
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {booking.appointmentDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {booking.appointmentTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {booking.customerAddress.split(',').slice(0, 2).join(',')}
                    </span>
                  </div>

                  {/* Price & Action Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-[#E5E7EB]">
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-[#6B7280]">Diagnostic: </span>
                        <span className="font-bold text-[#0B0F0E]">{formatCurrency(booking.diagnosticFee)}</span>
                      </div>
                      <div>
                        <span className="text-[#6B7280]">Estimate: </span>
                        <span className="font-bold text-[#0B0F0E]">
                          {formatCurrency(booking.totalEstimateLow)} – {formatCurrency(booking.totalEstimateHigh)}
                        </span>
                      </div>
                      {booking.paymentStatus && (
                        <div>
                          <span className="text-[#6B7280]">Payment: </span>
                          <span className={`font-bold ${
                            booking.paymentStatus === 'refunded_to_customer' ? 'text-[#DC2626]' :
                            booking.paymentStatus === 'released_to_worker' ? 'text-[#16A34A]' :
                            booking.paymentStatus === 'disputed_hold' ? 'text-[#D97706]' :
                            'text-[#2563EB]'
                          }`}>
                            {booking.paymentStatus.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                          </span>
                        </div>
                      )}
                    </div>
                    <Link href="/customer/dashboard">
                      <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                        Manage
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No bookings found"
            description={
              searchQuery
                ? `No bookings match "${searchQuery}". Try a different search term.`
                : filterStatus !== 'all'
                ? `No bookings with status "${filterStatus}".`
                : 'You haven\'t made any bookings yet. Browse services to get started.'
            }
            onReset={() => {
              setSearchQuery('');
              setFilterStatus('all');
            }}
            actionText={searchQuery || filterStatus !== 'all' ? 'Clear Filters' : undefined}
          />
        )}

        {/* Help Link */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#6B7280]">
            Need help managing a booking?{' '}
            <Link href="/customer/dashboard" className="text-[#2563EB] hover:underline font-semibold">
              Open your full Customer Dashboard
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
