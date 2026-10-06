'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { updateDemoBookingStatus, useBookings, useFavorites } from '@/lib/demo-storage';
import { professionals } from '@/data/professionals';
import { BookingListItem } from '@/components/dashboard/booking-list-item';
import { ProfessionalGrid } from '@/components/professionals/professional-grid';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/context/toast-context';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'favorites'>('upcoming');

  const bookings = useBookings();
  const favoriteIds = useFavorites();

  // Handle Cancellation
  const handleCancelBooking = (bookingId: string) => {
    updateDemoBookingStatus(bookingId, 'cancelled');

    showToast({
      type: 'info',
      title: 'Appointment Cancelled',
      message: `Booking #${bookingId} was cancelled. Escrow payment hold has been released. (Demo state)`,
    });
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'in_progress'
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );
  const favoritedPros = professionals.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="py-8 sm:py-12 bg-[#f8f8f4]">
      <Container>
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl border border-[#e3e8e3] p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#e7f4ed] text-[#143d35]">
                  Customer Account Demo
                </span>
                <span className="text-xs text-[#66716d]">Session ID: DEMO-USR-881</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172522]">
                Welcome back, Sarah
              </h1>
              <p className="text-xs sm:text-sm text-[#66716d] mt-1">
                Manage your service appointments, inspect estimates, and view saved professionals.
              </p>
            </div>

            <Link href="/professionals">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
                className="font-bold shadow-xs whitespace-nowrap"
              >
                Book New Service
              </Button>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#e3e8e3]">
            <div>
              <span className="text-xs text-[#66716d]">Active Bookings</span>
              <p className="text-2xl font-bold text-[#143d35] mt-0.5">
                {upcomingBookings.length}
              </p>
            </div>
            <div>
              <span className="text-xs text-[#66716d]">Saved Pros</span>
              <p className="text-2xl font-bold text-[#172522] mt-0.5">
                {favoritedPros.length}
              </p>
            </div>
            <div>
              <span className="text-xs text-[#66716d]">Past Jobs</span>
              <p className="text-2xl font-bold text-[#172522] mt-0.5">
                {pastBookings.length}
              </p>
            </div>
            <div>
              <span className="text-xs text-[#66716d]">Protection Status</span>
              <p className="text-xs font-bold text-[#16794b] flex items-center gap-1 mt-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Escrow Active</span>
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-[#e3e8e3] mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 -mb-px transition-all ${
              activeTab === 'upcoming'
                ? 'border-[#237a63] text-[#143d35]'
                : 'border-transparent text-[#66716d] hover:text-[#172522]'
            }`}
          >
            Upcoming Appointments ({upcomingBookings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('past')}
            className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 -mb-px transition-all ${
              activeTab === 'past'
                ? 'border-[#237a63] text-[#143d35]'
                : 'border-transparent text-[#66716d] hover:text-[#172522]'
            }`}
          >
            Past & History ({pastBookings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 -mb-px transition-all ${
              activeTab === 'favorites'
                ? 'border-[#237a63] text-[#143d35]'
                : 'border-transparent text-[#66716d] hover:text-[#172522]'
            }`}
          >
            Saved Pros ({favoritedPros.length})
          </button>
        </div>

        {/* TAB CONTENT */}
        {activeTab === 'upcoming' && (
          <div className="flex flex-col gap-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((b) => (
                <BookingListItem
                  key={b.id}
                  booking={b}
                  onCancelBooking={handleCancelBooking}
                />
              ))
            ) : (
              <EmptyState
                title="No active appointments scheduled"
                description="You have no upcoming service appointments. Need help with plumbing, electrical, or repairs?"
                icon={<Calendar className="w-7 h-7" />}
                onReset={() => {
                  window.location.href = '/professionals';
                }}
                actionText="Find & Book a Local Pro"
              />
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="flex flex-col gap-4">
            {pastBookings.length > 0 ? (
              pastBookings.map((b) => (
                <BookingListItem key={b.id} booking={b} />
              ))
            ) : (
              <EmptyState
                title="No past booking records"
                description="Completed services and past records will be cataloged here."
                icon={<CheckCircle2 className="w-7 h-7" />}
              />
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            {favoritedPros.length > 0 ? (
              <ProfessionalGrid professionals={favoritedPros} columns="3" />
            ) : (
              <EmptyState
                title="No saved professionals yet"
                description="Click the heart icon on any professional card to save them to your personal favorites list."
                icon={<Heart className="w-7 h-7" />}
                onReset={() => {
                  window.location.href = '/professionals';
                }}
                actionText="Explore Verified Professionals"
              />
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
