'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  ShieldCheck,
  Calendar,
  Clock,
  DollarSign,
  Star,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { StatCard } from '@/components/dashboard/stat-card';
import { JobRequestCard } from '@/components/dashboard/job-request-card';
import { AvailabilitySwitch } from '@/components/forms/availability-switch';
import { initialWorkerRequests } from '@/data/bookings';
import { JobRequest } from '@/types/booking';
import { Button } from '@/components/ui/button';

export default function WorkerDashboardPage() {
  const [isAvailableToday, setIsAvailableToday] = useState(true);
  const [requests, setRequests] = useState<JobRequest[]>(initialWorkerRequests);

  const handleStatusChange = (id: string, newStatus: 'accepted' | 'declined') => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const acceptedCount = requests.filter((r) => r.status === 'accepted').length;

  return (
    <div className="py-8 sm:py-12 bg-[#f8f8f4]">
      <Container>
        {/* Worker Header Card */}
        <div className="bg-white rounded-3xl border border-[#e3e8e3] p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#143d35] text-white flex items-center justify-center font-bold text-2xl flex-shrink-0 overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80"
                  alt="Marcus Vance"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#e7f4ed] text-[#143d35]">
                    Worker Demo Portal
                  </span>
                  <span className="text-xs text-[#16794b] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    License #982410-C36 Verified
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172522]">
                  Marcus Vance
                </h1>
                <p className="text-xs sm:text-sm text-[#66716d]">
                  Master Plumber & Pipe Specialist • San Francisco Metro
                </p>
              </div>
            </div>

            {/* Availability Toggle Box */}
            <div className="p-4 rounded-2xl bg-[#f8f8f4] border border-[#e3e8e3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <AvailabilitySwitch
                isAvailable={isAvailableToday}
                onToggle={(val) => setIsAvailableToday(val)}
              />

              <Link href="/professionals/marcus-vance">
                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  View Public Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Performance Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#e3e8e3]">
            <StatCard
              label="Monthly Payout"
              value="$4,280"
              subtext="Stripe Auto-release"
              icon={<DollarSign className="w-5 h-5" />}
            />
            <StatCard
              label="Overall Rating"
              value="4.95 ★"
              subtext="142 verified reviews"
              icon={<Star className="w-5 h-5" />}
            />
            <StatCard
              label="Pending Requests"
              value={pendingCount}
              subtext="Awaiting your response"
              icon={<Clock className="w-5 h-5" />}
            />
            <StatCard
              label="Completed Jobs"
              value="486"
              subtext="100% Escrow sign-off"
              icon={<CheckCircle2 className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Job Requests Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-[#172522]">
                Incoming Job Requests ({pendingCount} Action Required)
              </h2>
              <p className="text-xs text-[#66716d] mt-0.5">
                Homeowners who booked appointments through your transparent diagnostic fee listing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {requests.map((req) => (
              <JobRequestCard
                key={req.id}
                request={req}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>

        {/* Weekly Schedule Timeline Preview */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e3e8e3] shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#e3e8e3] mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#237a63]" />
              <h3 className="font-bold text-base text-[#172522]">
                Weekly Dispatch Schedule
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#e7f4ed] text-[#143d35]">
              {acceptedCount} Scheduled Visits
            </span>
          </div>

          <div className="divide-y divide-[#e3e8e3] text-xs sm:text-sm">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#172522] block">Today, Oct 5 • 3:30 PM - 5:30 PM</span>
                <span className="text-xs text-[#66716d]">Jonathan Hall • Dual Vanity Valve Replacement • Pacific Heights</span>
              </div>
              <span className="font-bold text-[#16794b] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
                Confirmed
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#172522] block">Tomorrow, Oct 6 • 10:00 AM - 12:00 PM</span>
                <span className="text-xs text-[#66716d]">Sarah Jenkins • Slow Drain & Corroded P-Trap • Castro Street</span>
              </div>
              <span className="font-bold text-[#16794b] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
                Confirmed
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#172522] block">Thursday, Oct 8 • 8:00 AM - 10:00 AM</span>
                <span className="text-xs text-[#66716d]">Reserved for Diagnostic Emergency Hold</span>
              </div>
              <span className="text-xs text-[#66716d] italic">
                Open Dispatch Slot
              </span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
