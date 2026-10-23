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
  User,
  MapPin,
  Edit2,
  Save,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { updateDemoBookingStatus, useBookings, useFavorites, useProfessionalsList } from '@/lib/demo-storage';
import { BookingListItem } from '@/components/dashboard/booking-list-item';
import { ProfessionalGrid } from '@/components/professionals/professional-grid';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/context/toast-context';
import { useAuth } from '@/context/auth-context';
import { computeCustomerMetrics } from '@/lib/metrics';
import { PrototypeDisclaimer } from '@/components/ui/prototype-disclaimer';
import { formatCurrency } from '@/lib/formatters';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, updateProfile } = useAuth();
  const allPros = useProfessionalsList();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'favorites' | 'profile'>('upcoming');

  // Customer Profile Editor State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [phoneInput, setPhoneInput] = useState(user.phone || '');
  const [addressInput, setAddressInput] = useState(user.address || '');
  const [cityInput, setCityInput] = useState(user.city || '');
  const [zipInput, setZipInput] = useState(user.zipCode || '');

  const [prevUserId, setPrevUserId] = useState(user.id);
  if (user.id !== prevUserId) {
    setPrevUserId(user.id);
    setNameInput(user.name);
    setPhoneInput(user.phone || '');
    setAddressInput(user.address || '');
    setCityInput(user.city || '');
    setZipInput(user.zipCode || '');
  }

  const bookings = useBookings();
  const favoriteIds = useFavorites();

  // Handle Cancellation
  const handleCancelBooking = (bookingId: string) => {
    updateDemoBookingStatus(bookingId, 'cancelled', 'Customer requested cancellation');

    showToast({
      type: 'info',
      title: 'Appointment Cancelled',
      message: `Booking #${bookingId} was cancelled. Escrow pre-authorization hold released immediately.`,
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: nameInput,
      phone: phoneInput,
      address: addressInput,
      city: cityInput,
      zipCode: zipInput,
    });
    setIsEditingProfile(false);
    showToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your contact details and primary service address have been saved.',
    });
  };

  const metrics = computeCustomerMetrics(bookings, favoriteIds);
  const upcomingBookings = bookings.filter(
    (b) => b.status === 'pending' || b.status === 'confirmed' || b.status === 'in_progress' || b.status === 'disputed'
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled' || b.status === 'declined'
  );
  const favoritedPros = allPros.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="py-6 sm:py-12 bg-[#F8FAFC]">
      <Container>
        {/* Prototype Simulated Data Disclaimer */}
        <div className="mb-6">
          <PrototypeDisclaimer variant="banner" className="rounded-2xl" />
        </div>

        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5E7EB] p-4 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0B0F0E] text-white flex items-center justify-center font-bold text-xl sm:text-2xl overflow-hidden shadow-xs flex-shrink-0">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name[0]
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB]">
                    Customer Account
                  </span>
                  <span className="text-[11px] text-[#4B5563]">ID: {user.id}</span>
                </div>
                <h1 className="text-xl sm:text-3xl font-black text-[#111827] tracking-tight">
                  Welcome back, {user.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#4B5563] mt-0.5 leading-relaxed">
                  Manage your service appointments, track pre-authorized escrow holds, and update your home address.
                </p>
              </div>
            </div>

            <Link href="/professionals" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
                className="font-bold shadow-xs whitespace-nowrap w-full sm:w-auto justify-center min-h-[44px]"
              >
                Book New Service
              </Button>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-[#E5E7EB]">
            <div>
              <span className="text-[11px] sm:text-xs font-semibold text-[#4B5563]">Active Appointments</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#111827] mt-0.5">
                {metrics.activeAppointmentsCount}
              </p>
            </div>
            <div>
              <span className="text-[11px] sm:text-xs font-semibold text-[#4B5563]">Saved Professionals</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#111827] mt-0.5">
                {metrics.savedProsCount}
              </p>
            </div>
            <div>
              <span className="text-[11px] sm:text-xs font-semibold text-[#4B5563]">Completed Services</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#16A34A] mt-0.5">
                {metrics.completedBookingsCount}
              </p>
            </div>
            <div>
              <span className="text-[11px] sm:text-xs font-semibold text-[#4B5563]">Escrow Protection</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#16A34A] mt-0.5">
                {metrics.activeEscrowTotal > 0 ? formatCurrency(metrics.activeEscrowTotal) : '$2,500 Guarantee'}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-[#E5E7EB] mb-6 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`py-2.5 sm:py-3 px-3.5 sm:px-5 text-xs sm:text-sm font-bold border-b-2 -mb-px transition-all whitespace-nowrap min-h-[44px] ${
              activeTab === 'upcoming'
                ? 'border-[#16A34A] text-[#16A34A]'
                : 'border-transparent text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            Upcoming Appointments ({upcomingBookings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('past')}
            className={`py-2.5 sm:py-3 px-3.5 sm:px-5 text-xs sm:text-sm font-bold border-b-2 -mb-px transition-all whitespace-nowrap min-h-[44px] ${
              activeTab === 'past'
                ? 'border-[#16A34A] text-[#16A34A]'
                : 'border-transparent text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            Past & Completed ({pastBookings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 -mb-px transition-all whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'border-[#16A34A] text-[#16A34A]'
                : 'border-transparent text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            Saved Pros ({favoritedPros.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 -mb-px transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-[#16A34A] text-[#16A34A]'
                : 'border-transparent text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            Profile & Address
          </button>
        </div>

        {/* TAB 1: UPCOMING APPOINTMENTS */}
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
                description="You have no upcoming service appointments. Need help with plumbing, electrical, carpentry, or HVAC?"
                icon={<Calendar className="w-7 h-7" />}
                onReset={() => {
                  router.push('/professionals');
                }}
                actionText="Find & Book a Local Pro"
              />
            )}
          </div>
        )}

        {/* TAB 2: PAST BOOKINGS */}
        {activeTab === 'past' && (
          <div className="flex flex-col gap-4">
            {pastBookings.length > 0 ? (
              pastBookings.map((b) => (
                <BookingListItem key={b.id} booking={b} />
              ))
            ) : (
              <EmptyState
                title="No past booking records"
                description="Completed services and historical invoices will be cataloged here once performed."
                icon={<CheckCircle2 className="w-7 h-7" />}
              />
            )}
          </div>
        )}

        {/* TAB 3: FAVORITES */}
        {activeTab === 'favorites' && (
          <div>
            {favoritedPros.length > 0 ? (
              <ProfessionalGrid professionals={favoritedPros} columns="3" />
            ) : (
              <EmptyState
                title="No saved professionals yet"
                description="Click the heart icon on any professional card to save them to your personal shortlist."
                icon={<Heart className="w-7 h-7" />}
                onReset={() => {
                  router.push('/professionals');
                }}
                actionText="Explore Verified Professionals"
              />
            )}
          </div>
        )}

        {/* TAB 4: PROFILE & ADDRESS MANAGEMENT */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-[#E4E7EC] p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between pb-6 border-b border-[#E4E7EC] mb-6">
              <div>
                <h3 className="font-bold text-lg text-[#173B67]">Account & Service Address</h3>
                <p className="text-xs text-[#667085]">
                  Manage the default dispatch address and contact info used during checkout.
                </p>
              </div>
              {!isEditingProfile ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNameInput(user.name);
                    setPhoneInput(user.phone || '');
                    setAddressInput(user.address || '');
                    setCityInput(user.city || '');
                    setZipInput(user.zipCode || '');
                    setIsEditingProfile(true);
                  }}
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingProfile(false)}
                >
                  Cancel
                </Button>
              )}
            </div>

            {!isEditingProfile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E4E7EC] space-y-3">
                  <div className="flex items-center gap-2 font-bold text-[#173B67] text-xs uppercase tracking-wider">
                    <User className="w-4 h-4 text-[#0F9D91]" />
                    <span>Contact Information</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#667085] block">Full Name</span>
                    <span className="font-bold text-[#263445]">{user.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#667085] block">Email Address</span>
                    <span className="font-medium text-[#263445]">{user.email}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#667085] block">Primary Phone</span>
                    <span className="font-medium text-[#263445]">{user.phone || 'None on file'}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E4E7EC] space-y-3">
                  <div className="flex items-center gap-2 font-bold text-[#173B67] text-xs uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-[#0F9D91]" />
                    <span>Default Service Address</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#667085] block">Street Address</span>
                    <span className="font-bold text-[#263445]">{user.address || '428 Castro Street, Apt 3B'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#667085] block">City & State</span>
                    <span className="font-medium text-[#263445]">{user.city || 'San Francisco, CA'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#667085] block">Postal Code</span>
                    <span className="font-medium text-[#263445]">{user.zipCode || '94114'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-[#263445] uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D0D5DD] text-sm focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#263445] uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D0D5DD] text-sm focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#263445] uppercase tracking-wider mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D0D5DD] text-sm focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#263445] uppercase tracking-wider mb-1">
                      City, State
                    </label>
                    <input
                      type="text"
                      required
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#D0D5DD] text-sm focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#263445] uppercase tracking-wider mb-1">
                      Postal Code (ZIP)
                    </label>
                    <input
                      type="text"
                      required
                      value={zipInput}
                      onChange={(e) => setZipInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#D0D5DD] text-sm focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
