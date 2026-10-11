'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Layers,
  Search,
  ExternalLink,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import {
  useVerificationRecords,
  updateVerificationRecordStatus,
  useBookings,
  updateDemoBookingStatus,
  getCustomProfessionals,
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

  const records = useVerificationRecords();
  const bookings = useBookings();
  const professionals = getCustomProfessionals();

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

  const pendingRecords = records.filter(
    (r) => r.status === 'pending' || r.status === 'submitted'
  );

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
              <span className="text-xs font-semibold text-[#667085]">Total Platform Bookings</span>
              <p className="text-2xl font-black text-[#263445] mt-0.5">
                {bookings.length}
              </p>
              <span className="text-[11px] text-[#0F9D91] font-semibold">Under escrow protection</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#667085]">Dispute Rate</span>
              <p className="text-2xl font-black text-[#15803D] mt-0.5">
                0.2%
              </p>
              <span className="text-[11px] text-[#667085]">Below 1.0% platform threshold</span>
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

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  placeholder="Filter by license or issuer..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                />
              </div>
            </div>

            <div className="space-y-4">
              {records
                .filter(
                  (r) =>
                    !auditSearch ||
                    r.title.toLowerCase().includes(auditSearch.toLowerCase()) ||
                    r.documentNumber?.toLowerCase().includes(auditSearch.toLowerCase()) ||
                    r.issuer?.toLowerCase().includes(auditSearch.toLowerCase())
                )
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

        {/* TAB 2: BOOKINGS & ESCROW DISPUTE OVERSIGHT */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-[#E4E7EC] p-6 sm:p-8 shadow-xs">
            <div className="pb-6 border-b border-[#E4E7EC] mb-6">
              <h3 className="font-bold text-lg text-[#173B67]">
                Platform Escrow & Booking Lifecycle Oversight
              </h3>
              <p className="text-xs text-[#667085]">
                View all scheduled and historical bookings. Platform administrators can intervene to resolve disputes or force escrow disbursement.
              </p>
            </div>

            <div className="divide-y divide-[#E4E7EC]">
              {bookings.map((b) => (
                <div key={b.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs sm:text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#173B67]">#{b.id}</span>
                      <span className="font-bold text-[#263445]">{b.customerName} → {b.professionalName}</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#EBF1F8] text-[#173B67]">
                        {b.categoryName}
                      </span>
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
      </Container>
    </div>
  );
}
