'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  Lock,
  Scale,
  Filter,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import {
  useVerificationRecords,
  updateVerificationRecordStatus,
  useBookings,
  updateDemoBookingStatus,
  resolveDemoBookingDispute,
  useProfessionalsList,
} from '@/lib/demo-storage';
import { VerificationStatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/toast-context';
import { useAuth } from '@/context/auth-context';
import { formatCurrency } from '@/lib/formatters';
import { serviceCategories } from '@/data/services';

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const { role, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'verifications' | 'bookings' | 'categories' | 'disputes'>('verifications');
  const [auditSearch, setAuditSearch] = useState('');
  const [auditStatusFilter, setAuditStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [mediationNotes, setMediationNotes] = useState<Record<string, string>>({});

  const records = useVerificationRecords();
  const bookings = useBookings();
  const professionals = useProfessionalsList();

  const pendingRecords = records.filter(
    (r) => r.status === 'pending' || r.status === 'submitted'
  );
  const disputedBookings = bookings.filter((b) => b.status === 'disputed');
  const activeEscrowAmount = bookings
    .filter((b) => b.paymentStatus === 'authorized_hold' || b.paymentStatus === 'disputed_hold')
    .reduce((sum, b) => sum + b.diagnosticFee, 0);

  // If user is not admin, show guard with quick authorization button
  if (role !== 'admin') {
    return (
      <div className="py-20 bg-[#F7F8FA]">
        <Container size="narrow" className="text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#EBF1F8] text-[#173B67] flex items-center justify-center mx-auto mb-4 border border-[#E4E7EC]">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B67]">
            Administrator Access Required
          </h1>
          <p className="text-sm text-[#667085] mt-2 mb-6 max-w-md mx-auto">
            The verification desk and platform escrow oversight require administrator permissions. You are currently viewing as &ldquo;{role}&rdquo;.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                switchRole('admin');
                showToast({
                  type: 'success',
                  title: 'Admin Session Activated',
                  message: 'Welcome Alex Rivera (Operations Desk).',
                });
              }}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Authenticate as Administrator (Alex Rivera)
            </Button>
            <Link href="/">
              <Button variant="outline" size="lg">
                Return to Homepage
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // Handle Verification Review Actions
  const handleApproveRecord = (id: string) => {
    updateVerificationRecordStatus(id, 'verified', 'Approved by operations desk audit.');
    showToast({
      type: 'success',
      title: 'Verification Approved',
      message: `Record #${id} marked as Verified Active. Contractor credentials updated.`,
    });
  };

  const handleRejectRecord = (id: string) => {
    updateVerificationRecordStatus(id, 'rejected', 'Verification rejected: documentation expired or mismatched.');
    showToast({
      type: 'error',
      title: 'Verification Rejected',
      message: `Record #${id} marked as Rejected. Technician notified to provide valid state filing.`,
    });
  };

  // Handle Escrow Dispute Intervention
  const handleForceRelease = (bookingId: string) => {
    updateDemoBookingStatus(bookingId, 'completed');
    showToast({
      type: 'success',
      title: 'Escrow Released',
      message: `Funds for booking #${bookingId} released to the service professional.`,
    });
  };

  const handleForceRefund = (bookingId: string) => {
    updateDemoBookingStatus(bookingId, 'cancelled', 'Admin resolved dispute in favor of customer refund.');
    showToast({
      type: 'info',
      title: 'Escrow Refunded',
      message: `Booking #${bookingId} pre-authorization returned in full to customer.`,
    });
  };

  const handleResolveDispute = (
    bookingId: string,
    decision: 'release_to_worker' | 'refund_to_customer'
  ) => {
    const note = mediationNotes[bookingId] || '';
    resolveDemoBookingDispute(bookingId, decision, note);
    showToast({
      type: decision === 'release_to_worker' ? 'success' : 'info',
      title: decision === 'release_to_worker' ? 'Dispute Resolved: Released to Pro' : 'Dispute Resolved: Refunded to Customer',
      message:
        decision === 'release_to_worker'
          ? `Escrow funds for #${bookingId} disbursed to contractor.`
          : `Escrow hold for #${bookingId} pre-authorization refunded in full to customer.`,
    });
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F7F8FA]">
      <Container>
        {/* Admin Header */}
        <div className="bg-white rounded-3xl border border-[#E4E7EC] p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EBF1F8] text-[#173B67]">
                  Platform Operations Desk
                </span>
                <span className="text-xs text-[#15803D] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Privileged RBAC Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#173B67] tracking-tight">
                SkillConnect Trust & Verification Oversight
              </h1>
              <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
                Review state trade licenses, commercial liability policies, dispute mediation, and category benchmarks.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchRole('customer')}
                className="text-xs"
              >
                Switch to Customer View
              </Button>
            </div>
          </div>

          {/* Platform Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E4E7EC]">
            <div>
              <span className="text-xs font-semibold text-[#667085]">Active Professionals</span>
              <p className="text-2xl font-black text-[#173B67] mt-0.5">
                {professionals.length}
              </p>
              <span className="text-[11px] text-[#15803D] font-semibold">100% background checked</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#667085]">Pending Audits</span>
              <p className="text-2xl font-black text-[#B54708] mt-0.5">
                {pendingRecords.length}
              </p>
              <span className="text-[11px] text-[#B54708]">Action required</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#667085]">Escrow Funds Protected</span>
              <p className="text-2xl font-black text-[#0F9D91] mt-0.5">
                {formatCurrency(activeEscrowAmount)}
              </p>
              <span className="text-[11px] text-[#0F9D91] font-semibold">Across {bookings.length} platform bookings</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#667085]">Disputes Desk</span>
              <p className={`text-2xl font-black mt-0.5 ${disputedBookings.length > 0 ? 'text-[#B42318]' : 'text-[#15803D]'}`}>
                {disputedBookings.length} Active
              </p>
              <span className="text-[11px] text-[#667085]">
                {disputedBookings.length > 0 ? 'Mediation required' : 'Zero unresolved disputes'}
              </span>
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex border-b border-[#E4E7EC] mb-8 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('verifications')}
            className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 -mb-px transition-all whitespace-nowrap ${
              activeTab === 'verifications'
                ? 'border-[#173B67] text-[#173B67]'
                : 'border-transparent text-[#667085] hover:text-[#263445]'
            }`}
          >
            Verification Audit Queue ({pendingRecords.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 -mb-px transition-all whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'border-[#173B67] text-[#173B67]'
                : 'border-transparent text-[#667085] hover:text-[#263445]'
            }`}
          >
            Escrow & Booking Oversight ({bookings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('disputes')}
            className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 -mb-px transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'disputes'
                ? 'border-[#B42318] text-[#B42318]'
                : 'border-transparent text-[#667085] hover:text-[#263445]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Disputes & Mediation</span>
            {disputedBookings.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#B42318] text-white text-[10px] font-black flex items-center justify-center">
                {disputedBookings.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 -mb-px transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-[#173B67] text-[#173B67]'
                : 'border-transparent text-[#667085] hover:text-[#263445]'
            }`}
          >
            Service Categories ({serviceCategories.length})
          </button>
        </div>

        {/* TAB 1: VERIFICATION AUDIT QUEUE */}
        {activeTab === 'verifications' && (
          <div className="bg-white rounded-3xl border border-[#E4E7EC] p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E7EC] mb-6">
              <div>
                <h3 className="font-bold text-lg text-[#173B67]">
                  Contractor Credential Verification Records
                </h3>
                <p className="text-xs text-[#667085]">
                  Never represent an unchecked worker as verified. Review official license numbers against state databases.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    placeholder="Filter by license, title, issuer..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                  />
                </div>
              </div>
            </div>

            {/* Status Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-5 text-xs">
              <span className="text-[#667085] font-semibold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter Status:</span>
              </span>
              {[
                { id: 'all', label: `All (${records.length})` },
                { id: 'pending', label: `Action Required (${pendingRecords.length})` },
                { id: 'verified', label: `Verified (${records.filter((r) => r.status === 'verified').length})` },
                { id: 'rejected', label: `Rejected (${records.filter((r) => r.status === 'rejected').length})` },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setAuditStatusFilter(f.id as typeof auditStatusFilter)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    auditStatusFilter === f.id
                      ? 'bg-[#173B67] text-white shadow-2xs'
                      : 'bg-[#F7F8FA] text-[#667085] hover:bg-[#E4E7EC]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {records
                .filter((r) => {
                  const matchesSearch =
                    !auditSearch ||
                    r.title.toLowerCase().includes(auditSearch.toLowerCase()) ||
                    r.documentNumber?.toLowerCase().includes(auditSearch.toLowerCase()) ||
                    r.issuer?.toLowerCase().includes(auditSearch.toLowerCase());
                  const matchesStatus =
                    auditStatusFilter === 'all'
                      ? true
                      : auditStatusFilter === 'pending'
                      ? r.status === 'pending' || r.status === 'submitted'
                      : r.status === auditStatusFilter;
                  return matchesSearch && matchesStatus;
                })
                .map((rec) => {
                  const isActionable = rec.status === 'pending' || rec.status === 'submitted';

                  return (
                    <div
                      key={rec.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isActionable
                          ? 'bg-amber-50/50 border-amber-200'
                          : 'bg-[#F7F8FA] border-[#E4E7EC]'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#173B67]">#{rec.id}</span>
                          <span className="font-bold text-sm text-[#263445]">{rec.title}</span>
                          <VerificationStatusBadge status={rec.status} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#667085] pt-1">
                          <div>
                            <span className="block text-[10px] uppercase font-bold">Issuer / Authority</span>
                            <span className="text-[#263445] font-medium">{rec.issuer || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-bold">Registration / License #</span>
                            <span className="font-mono text-[#173B67] font-bold">{rec.documentNumber}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-bold">Submitted Date</span>
                            <span className="text-[#263445]">{rec.submittedAt}</span>
                          </div>
                        </div>

                        {rec.notes && (
                          <p className="text-xs text-[#667085] bg-white p-2 rounded-lg border border-[#E4E7EC] mt-2">
                            <strong>Audit Note:</strong> {rec.notes}
                          </p>
                        )}
                      </div>

                      {/* Review Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#E4E7EC]">
                        {isActionable ? (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleApproveRecord(rec.id)}
                              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                              className="text-xs font-bold"
                            >
                              Approve & Verify
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRejectRecord(rec.id)}
                              leftIcon={<XCircle className="w-3.5 h-3.5" />}
                              className="text-xs text-[#B42318] hover:bg-red-50 hover:text-[#B42318]"
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-[#667085] font-semibold bg-white px-3 py-1.5 rounded-xl border border-[#E4E7EC]">
                            Audit Completed
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS & ESCROW OVERSIGHT */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-[#E4E7EC] p-6 sm:p-8 shadow-xs">
            <div className="pb-6 border-b border-[#E4E7EC] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-[#173B67]">
                  Platform Escrow & Booking Lifecycle Oversight
                </h3>
                <p className="text-xs text-[#667085]">
                  View all scheduled and historical bookings. Platform administrators can intervene to resolve disputes or force escrow disbursement.
                </p>
              </div>

              {/* Booking filter pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {['all', 'confirmed', 'completed', 'disputed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setBookingStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                      bookingStatusFilter === st
                        ? 'bg-[#173B67] text-white'
                        : 'bg-[#F7F8FA] text-[#667085] hover:bg-[#E4E7EC]'
                    }`}
                  >
                    {st === 'all' ? 'All Bookings' : st}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-[#E4E7EC]">
              {bookings
                .filter((b) => bookingStatusFilter === 'all' || b.status === bookingStatusFilter)
                .map((b) => (
                  <div key={b.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs sm:text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#173B67]">#{b.id}</span>
                        <span className="font-bold text-[#263445]">{b.customerName} → {b.professionalName}</span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#EBF1F8] text-[#173B67]">
                          {b.categoryName}
                        </span>
                        {b.status === 'disputed' && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#B42318] border border-red-200">
                            Disputed Escrow
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#667085]">
                        Scheduled: <strong>{b.appointmentDate} at {b.appointmentTime}</strong> • Diagnostic Hold: <strong>{formatCurrency(b.diagnosticFee)}</strong>
                      </p>
                      <p className="text-xs text-[#667085]">
                        Address: {b.customerAddress}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[11px] text-[#667085] block">Payment State</span>
                        <span className="font-bold text-[#173B67] capitalize">
                          {b.paymentStatus?.replace(/_/g, ' ') || 'Authorized Hold'}
                        </span>
                      </div>

                      {b.status === 'confirmed' && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleForceRelease(b.id)}
                            className="text-xs"
                          >
                            Release to Worker
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleForceRefund(b.id)}
                            className="text-xs text-[#B42318] hover:bg-red-50"
                          >
                            Force Refund
                          </Button>
                        </div>
                      )}

                      {b.status === 'disputed' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setActiveTab('disputes')}
                          leftIcon={<Scale className="w-3.5 h-3.5" />}
                          className="text-xs bg-[#B42318] hover:bg-[#912018]"
                        >
                          Review in Disputes Desk
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: SERVICE CATEGORY MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-3xl border border-[#E4E7EC] p-6 sm:p-8 shadow-xs">
            <div className="pb-6 border-b border-[#E4E7EC] mb-6">
              <h3 className="font-bold text-lg text-[#173B67]">
                Marketplace Trade Categories & Baseline Diagnostic Minimums
              </h3>
              <p className="text-xs text-[#667085]">
                Regulate starting diagnostic thresholds and trade specialty assignments.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceCategories.map((cat) => (
                <div key={cat.id} className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E4E7EC] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#173B67]">{cat.name}</span>
                    <span className="text-xs text-[#667085] font-semibold">{cat.professionalCount} Pros</span>
                  </div>
                  <p className="text-xs text-[#667085] line-clamp-2">{cat.shortDescription}</p>
                  <div className="pt-2 border-t border-[#E4E7EC] flex justify-between items-center text-xs">
                    <span className="text-[#667085]">Standard Diagnostic Fee:</span>
                    <span className="font-bold text-[#173B67]">{formatCurrency(cat.startingPrice)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DISPUTES & ESCROW MEDIATION DESK */}
        {activeTab === 'disputes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#E4E7EC] p-6 sm:p-8 shadow-xs">
              <div className="pb-6 border-b border-[#E4E7EC] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-[#B42318] border border-red-200">
                      Dispute Mediation Desk
                    </span>
                    <span className="text-xs text-[#667085]">
                      $2,500 Platform Workmanship Guarantee
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-[#173B67]">
                    Active Escrow Mediation & Conflict Resolution
                  </h3>
                  <p className="text-xs text-[#667085] mt-0.5">
                    When either party reports non-performance, diagnostic mismatch, or quality disagreement, funds are held in escrow pending impartial platform mediation.
                  </p>
                </div>
              </div>

              {disputedBookings.length > 0 ? (
                <div className="space-y-6">
                  {disputedBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-6 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#B42318] text-white flex items-center justify-center font-bold">
                            <Scale className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-mono text-xs font-bold text-[#173B67]">#{b.id}</span>
                            <h4 className="font-bold text-sm text-[#263445]">
                              {b.customerName} vs. {b.professionalName} ({b.categoryName})
                            </h4>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-[#667085] block">Held in Escrow:</span>
                          <span className="text-lg font-black text-[#173B67]">
                            {formatCurrency(b.diagnosticFee)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-xl bg-white border border-[#E4E7EC] space-y-1.5">
                          <span className="font-bold text-[#173B67] block uppercase tracking-wider text-[10px]">
                            Dispute Grounds Filed by Homeowner
                          </span>
                          <p className="text-[#263445] leading-relaxed italic">
                            &ldquo;{b.disputeReason || 'Homeowner contested diagnostic completion or arrival window punctuality.'}&rdquo;
                          </p>
                          <span className="text-[11px] text-[#667085] block mt-1">
                            Service Date: {b.appointmentDate} • Time: {b.appointmentTime}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white border border-[#E4E7EC] space-y-1.5">
                          <span className="font-bold text-[#173B67] block uppercase tracking-wider text-[10px]">
                            Contractor Profile & Credential Audit
                          </span>
                          <p className="text-[#263445]">
                            <strong>{b.professionalName}</strong> • {b.professionalTrade}
                          </p>
                          <p className="text-[#667085]">
                            Service Address: {b.customerAddress}
                          </p>
                          <span className="inline-block text-[10px] font-bold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-1">
                            Verified State Trade License
                          </span>
                        </div>
                      </div>

                      {/* Mediation Decision Action Box */}
                      <div className="pt-3 border-t border-amber-200 space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[#263445] uppercase tracking-wider mb-1">
                            Administrative Audit Resolution Note:
                          </label>
                          <input
                            type="text"
                            value={mediationNotes[b.id] || ''}
                            onChange={(e) =>
                              setMediationNotes((prev) => ({ ...prev, [b.id]: e.target.value }))
                            }
                            placeholder="e.g. Verified late arrival via GPS logs, granting full customer refund."
                            className="w-full p-2.5 rounded-xl border border-[#D0D5DD] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolveDispute(b.id, 'release_to_worker')}
                            leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />}
                            className="text-xs font-bold"
                          >
                            Rule for Pro (Release Escrow)
                          </Button>

                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleResolveDispute(b.id, 'refund_to_customer')}
                            leftIcon={<XCircle className="w-3.5 h-3.5" />}
                            className="text-xs font-bold bg-[#B42318] hover:bg-[#912018]"
                          >
                            Rule for Customer (100% Refund)
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[#F7F8FA] rounded-2xl border border-dashed border-[#D0D5DD]">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#15803D] flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-[#173B67]">
                    Zero Active Escrow Disputes
                  </h4>
                  <p className="text-xs text-[#667085] mt-1 max-w-sm mx-auto">
                    All completed appointments have received mutual customer sign-off with smooth escrow release.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
