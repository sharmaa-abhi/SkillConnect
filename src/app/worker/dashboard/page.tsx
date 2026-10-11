'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Calendar,
  Clock,
  DollarSign,
  Star,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Save,
  FileCheck,
  MessageSquare,
  UploadCloud,
  AlertTriangle,
  Send,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { StatCard } from '@/components/dashboard/stat-card';
import { JobRequestCard } from '@/components/dashboard/job-request-card';
import { AvailabilitySwitch } from '@/components/forms/availability-switch';
import {
  useWorkerRequests,
  updateJobRequestStatus,
  useBookings,
  getCustomProfessionals,
  saveCustomProfessional,
  replyToProReview,
  useVerificationRecords,
  submitVerificationRecord,
} from '@/lib/demo-storage';
import { VerificationStatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/toast-context';
import { formatCurrency } from '@/lib/formatters';
import { ServicePriceItem, WorkingHour, Professional, Review } from '@/types/professional';

export default function WorkerDashboardPage() {
  const { showToast } = useToast();
  const requests = useWorkerRequests();
  const bookings = useBookings();
  const allPros = getCustomProfessionals();
  const verificationRecords = useVerificationRecords();

  // Find worker profile (defaulting to Marcus Vance)
  const workerPro = allPros.find((p: Professional) => p.id === 'pro-marcus-vance') || allPros[0];

  const [activeTab, setActiveTab] = useState<'requests' | 'services' | 'hours' | 'verification' | 'reviews' | 'payouts'>('requests');
  const [isAvailableToday, setIsAvailableToday] = useState(workerPro.availableToday);

  // Services & Pricing Form State
  const [diagnosticFee, setDiagnosticFee] = useState(workerPro.diagnosticFee);
  const [hourlyRate, setHourlyRate] = useState(workerPro.hourlyRate);
  const [pricingItems, setPricingItems] = useState<ServicePriceItem[]>(workerPro.pricingItems);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(85);
  const [newServiceUnit, setNewServiceUnit] = useState<'hr' | 'fixed' | 'diagnostic'>('hr');

  // Working Hours State
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>(workerPro.workingHours);

  // Verification Submission Form State
  const [docType, setDocType] = useState<'trade_license' | 'insurance' | 'government_id' | 'background_check'>('trade_license');
  const [docTitle, setDocTitle] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [docIssuer, setDocIssuer] = useState('');
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);

  // Review Reply State
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Handle Availability Toggle
  const handleAvailabilityToggle = (val: boolean) => {
    setIsAvailableToday(val);
    const updated = { ...workerPro, availableToday: val };
    saveCustomProfessional(updated);
  };

  // Handle Job Requests status
  const handleStatusChange = (id: string, newStatus: 'accepted' | 'declined') => {
    updateJobRequestStatus(id, newStatus);
  };

  // Add a new service pricing item
  const handleAddServiceItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle.trim()) return;
    const newItem: ServicePriceItem = {
      id: `p-${Date.now()}`,
      title: newServiceTitle.trim(),
      description: newServiceDesc.trim() || 'Standard professional execution with guaranteed workmanship.',
      price: Number(newServicePrice) || 85,
      unit: newServiceUnit,
    };
    const updated = [...pricingItems, newItem];
    setPricingItems(updated);
    setNewServiceTitle('');
    setNewServiceDesc('');
    showToast({
      type: 'success',
      title: 'Service Added',
      message: `"${newItem.title}" added to your service catalog. Remember to save changes.`,
    });
  };

  const handleRemoveServiceItem = (id: string) => {
    setPricingItems(pricingItems.filter((item) => item.id !== id));
  };

  const handleSaveServices = () => {
    const updated = {
      ...workerPro,
      diagnosticFee: Number(diagnosticFee),
      hourlyRate: Number(hourlyRate),
      pricingItems,
    };
    saveCustomProfessional(updated);
    showToast({
      type: 'success',
      title: 'Pricing Updated',
      message: 'Your diagnostic fee and service catalog have been updated on your live public profile.',
    });
  };

  const handleSaveWorkingHours = () => {
    const updated = {
      ...workerPro,
      workingHours,
    };
    saveCustomProfessional(updated);
    showToast({
      type: 'success',
      title: 'Schedule Updated',
      message: 'Your weekly dispatch working hours have been saved.',
    });
  };

  // Verification document submission
  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docNumber.trim()) {
      showToast({
        type: 'error',
        title: 'Fields Required',
        message: 'Please provide document title and registration number.',
      });
      return;
    }

    setIsSubmittingDoc(true);
    setTimeout(() => {
      submitVerificationRecord({
        type: docType,
        title: docTitle.trim(),
        documentNumber: docNumber.trim(),
        issuer: docIssuer.trim() || 'State Licensing Board',
        status: 'pending',
        notes: `Submitted by ${workerPro.name} for compliance review.`,
      });
      setIsSubmittingDoc(false);
      setDocTitle('');
      setDocNumber('');
      setDocIssuer('');
      showToast({
        type: 'success',
        title: 'Credential Submitted',
        message: 'Document uploaded. Sent to administrator verification desk for credential audit.',
      });
    }, 600);
  };

  // Submit reply to review
  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    replyToProReview(workerPro.id, reviewId, replyText.trim());
    setReplyingReviewId(null);
    setReplyText('');
    showToast({
      type: 'success',
      title: 'Response Published',
      message: 'Your reply has been posted to the public review thread.',
    });
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const acceptedCount = requests.filter((r) => r.status === 'accepted').length;

  return (
    <div className="py-8 sm:py-12 bg-[#F7F8FA]">
      <Container>
        {/* Worker Header Card */}
        <div className="bg-white rounded-3xl border border-[#E4E7EC] p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#173B67] text-white flex items-center justify-center font-bold text-2xl flex-shrink-0 overflow-hidden shadow-xs">
                <img
                  src={workerPro.avatarUrl}
                  alt={workerPro.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EBF1F8] text-[#173B67]">
                    Pro Worker Portal
                  </span>
                  <span className="text-xs text-[#15803D] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0F9D91]" />
                    {workerPro.licenseNumber} Verified Active
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-[#173B67] tracking-tight">
                  {workerPro.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#667085]">
                  {workerPro.tradeTitle} • {workerPro.serviceAreas.slice(0, 3).join(', ')}
                </p>
              </div>
            </div>

            {/* Availability Toggle Box */}
            <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E4E7EC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <AvailabilitySwitch
                isAvailable={isAvailableToday}
                onToggle={handleAvailabilityToggle}
              />

              <Link href={`/professionals/${workerPro.slug}`}>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E4E7EC]">
            <StatCard
              label="Monthly Payouts"
              value="$4,280"
              subtext="Stripe Auto-release"
              icon={<DollarSign className="w-5 h-5" />}
            />
            <StatCard
              label="Overall Rating"
              value={`${workerPro.rating} ★`}
              subtext={`${workerPro.reviewCount} customer reviews`}
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
              value={workerPro.completedJobsCount}
              subtext="100% Escrow sign-off"
              icon={<CheckCircle2 className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Worker Navigation Tabs */}
        <div className="flex border-b border-[#E4E7EC] mb-8 overflow-x-auto">
          {[
            { id: 'requests', label: `Dispatch & Requests (${pendingCount})` },
            { id: 'services', label: 'Services & Pricing' },
            { id: 'hours', label: 'Working Hours' },
            { id: 'verification', label: 'Verification Center' },
            { id: 'reviews', label: `Reviews (${workerPro.reviews.length})` },
            { id: 'payouts', label: 'Earnings & Escrow' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 -mb-px transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#173B67] text-[#173B67]'
                  : 'border-transparent text-[#667085] hover:text-[#263445]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: DISPATCH & JOB REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-10">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#173B67]">
                    Incoming Job Requests ({pendingCount} Action Required)
                  </h2>
                  <p className="text-xs text-[#667085] mt-0.5">
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
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E4E7EC] shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC] mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0F9D91]" />
                  <h3 className="font-bold text-base text-[#173B67]">
                    Weekly Dispatch Schedule
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EBF1F8] text-[#173B67]">
                  {acceptedCount} Scheduled Visits
                </span>
              </div>

              <div className="divide-y divide-[#E4E7EC] text-xs sm:text-sm">
                <div className="py-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#263445] block">Today, Oct 11 • 3:30 PM - 5:30 PM</span>
                    <span className="text-xs text-[#667085]">Jonathan Hall • Dual Vanity Valve Replacement • Pacific Heights</span>
                  </div>
                  <span className="font-bold text-[#15803D] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
                    Confirmed
                  </span>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#263445] block">Tomorrow, Oct 12 • 10:00 AM - 12:00 PM</span>
                    <span className="text-xs text-[#667085]">Sarah Jenkins • Slow Drain & Corroded P-Trap • Castro Street</span>
                  </div>
                  <span className="font-bold text-[#15803D] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
                    Confirmed
                  </span>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#263445] block">Thursday, Oct 14 • 8:00 AM - 10:00 AM</span>
                    <span className="text-xs text-[#667085]">Reserved for Urgent Diagnostic Inspection</span>
                  </div>
                  <span className="text-xs text-[#667085] italic">
                    Open Dispatch Slot
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SERVICES & PRICING MANAGER */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E4E7EC] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC]">
                <div>
                  <h3 className="font-bold text-lg text-[#173B67]">Primary Rates & Diagnostic Policy</h3>
                  <p className="text-xs text-[#667085]">Standard inspection fees must be credited toward repair labor.</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveServices}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Rates
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#263445] uppercase tracking-wider mb-1.5">
                    Standard Diagnostic Fee ($)
                  </label>
                  <input
                    type="number"
                    value={diagnosticFee}
                    onChange={(e) => setDiagnosticFee(Number(e.target.value))}
                    className="w-full p-2.5 text-sm rounded-xl border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-[#173B67] font-bold text-[#173B67]"
                  />
                  <span className="text-[11px] text-[#667085] mt-1 block">
                    Credited 100% to customer labor bill upon work authorization.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#263445] uppercase tracking-wider mb-1.5">
                    Standard Hourly Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full p-2.5 text-sm rounded-xl border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-[#173B67] font-bold text-[#263445]"
                  />
                  <span className="text-[11px] text-[#667085] mt-1 block">
                    Base hourly charge for active trade labor on site.
                  </span>
                </div>
              </div>

              {/* Itemized Services List */}
              <div className="pt-4 border-t border-[#E4E7EC]">
                <h4 className="font-bold text-sm text-[#173B67] mb-3">Itemized Service Catalog ({pricingItems.length})</h4>
                <div className="space-y-3">
                  {pricingItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-[#F7F8FA] border border-[#E4E7EC] flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-xs text-[#263445] block">{item.title}</span>
                        <p className="text-[11px] text-[#667085] truncate">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="font-bold text-sm text-[#173B67]">
                          {formatCurrency(item.price)}
                          <span className="text-[10px] text-[#667085] font-normal">/{item.unit}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveServiceItem(item.id)}
                          className="p-1.5 rounded-lg text-[#667085] hover:text-[#B42318] hover:bg-red-50"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Service Item Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E4E7EC] p-6 shadow-xs">
              <h3 className="font-bold text-base text-[#173B67] mb-1">Add New Service Item</h3>
              <p className="text-xs text-[#667085] mb-4">Offer fixed-rate services or package repairs.</p>

              <form onSubmit={handleAddServiceItem} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#263445] mb-1 uppercase tracking-wider text-[11px]">
                    Service Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newServiceTitle}
                    onChange={(e) => setNewServiceTitle(e.target.value)}
                    placeholder="e.g. Tankless Water Heater Descale"
                    className="w-full p-2.5 rounded-xl border border-[#D0D5DD] text-xs focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#263445] mb-1 uppercase tracking-wider text-[11px]">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={newServiceDesc}
                    onChange={(e) => setNewServiceDesc(e.target.value)}
                    placeholder="Includes vinegar pump cycle, filter clearing, and safety check"
                    className="w-full p-2.5 rounded-xl border border-[#D0D5DD] text-xs focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-[#263445] mb-1 uppercase tracking-wider text-[11px]">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      required
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-[#D0D5DD] text-xs focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#263445] mb-1 uppercase tracking-wider text-[11px]">
                      Pricing Unit
                    </label>
                    <select
                      value={newServiceUnit}
                      onChange={(e) => setNewServiceUnit(e.target.value as 'hr' | 'fixed' | 'diagnostic')}
                      className="w-full p-2.5 rounded-xl border border-[#D0D5DD] text-xs focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                    >
                      <option value="fixed">Fixed Price</option>
                      <option value="hr">Per Hour</option>
                      <option value="diagnostic">Diagnostic Only</option>
                    </select>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full justify-center mt-2"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add to Catalog
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: WORKING HOURS */}
        {activeTab === 'hours' && (
          <div className="bg-white rounded-3xl border border-[#E4E7EC] p-6 sm:p-8 shadow-xs max-w-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC] mb-6">
              <div>
                <h3 className="font-bold text-lg text-[#173B67]">Weekly Dispatch Working Hours</h3>
                <p className="text-xs text-[#667085]">Configure your arrival availability for customer bookings.</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveWorkingHours}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Schedule
              </Button>
            </div>

            <div className="divide-y divide-[#E4E7EC] text-xs sm:text-sm">
              {workingHours.map((wh, idx) => (
                <div key={wh.day} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-32">
                    <input
                      type="checkbox"
                      checked={wh.isAvailable}
                      onChange={(e) => {
                        const updated = [...workingHours];
                        updated[idx].isAvailable = e.target.checked;
                        setWorkingHours(updated);
                      }}
                      className="rounded text-[#0F9D91] focus:ring-[#0F9D91]"
                    />
                    <span className="font-bold text-[#263445]">{wh.day}</span>
                  </div>

                  <input
                    type="text"
                    disabled={!wh.isAvailable}
                    value={wh.hours}
                    onChange={(e) => {
                      const updated = [...workingHours];
                      updated[idx].hours = e.target.value;
                      setWorkingHours(updated);
                    }}
                    className={`flex-1 p-2 rounded-xl border text-xs ${
                      wh.isAvailable
                        ? 'border-[#D0D5DD] bg-white text-[#263445]'
                        : 'border-[#E4E7EC] bg-[#F7F8FA] text-[#667085] italic'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: VERIFICATION CENTER */}
        {activeTab === 'verification' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl border border-[#E4E7EC] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-3 pb-4 border-b border-[#E4E7EC] mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF1F8] text-[#173B67] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6 text-[#0F9D91]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#173B67]">Credential & Verification Status</h3>
                    <p className="text-xs text-[#667085]">
                      SkillConnect enforces multi-tier proof of trade license, liability insurance, and identity liveness.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {verificationRecords.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E4E7EC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[#667085]">#{rec.id}</span>
                          <span className="font-bold text-sm text-[#263445]">{rec.title}</span>
                        </div>
                        <p className="text-xs text-[#667085]">
                          Issuer: <strong>{rec.issuer}</strong> • Number: <span className="font-mono">{rec.documentNumber}</span>
                        </p>
                        {rec.notes && <p className="text-[11px] text-[#667085] italic">{rec.notes}</p>}
                      </div>

                      <div className="flex sm:flex-col items-end justify-between gap-1">
                        <VerificationStatusBadge status={rec.status} />
                        {rec.expiresAt && (
                          <span className="text-[10px] text-[#667085]">Expires: {rec.expiresAt}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Document Submission Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E4E7EC] p-6 shadow-xs">
              <h3 className="font-bold text-base text-[#173B67] mb-1">Submit Credential for Review</h3>
              <p className="text-xs text-[#667085] mb-4">
                Upload new license certifications or updated liability insurance certificates.
              </p>

              <form onSubmit={handleSubmitVerification} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#263445] mb-1 uppercase tracking-wider text-[11px]">
                    Document Category
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as typeof docType)}
                    className="w-full p-2.5 rounded-xl border border-[#D0D5DD] text-xs focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                  >
                    <option value="trade_license">State Trade Contractor License</option>
                    <option value="insurance">Commercial General Liability Insurance</option>
                    <option value="background_check">Background Check Authorization</option>
                    <option value="government_id">Government Photo Identification</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#263445] mb-1 uppercase tracking-wider text-[11px]">
                    Document Title
                  </label>
                  <input
                    type="text"
                    required
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="e.g. California C-36 License Certificate"
                    className="w-full p-2.5 rounded-xl border border-[#D0D5DD] text-xs focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#263445] mb-1 uppercase tracking-wider text-[11px]">
                    Registration / License Number
                  </label>
                  <input
                    type="text"
                    required
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="e.g. CA-LIC-982410"
                    className="w-full p-2.5 rounded-xl border border-[#D0D5DD] text-xs focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#263445] mb-1 uppercase tracking-wider text-[11px]">
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    value={docIssuer}
                    onChange={(e) => setDocIssuer(e.target.value)}
                    placeholder="e.g. CSLB / Travelers Insurance"
                    className="w-full p-2.5 rounded-xl border border-[#D0D5DD] text-xs focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                  />
                </div>

                <div className="p-3.5 rounded-xl border border-dashed border-[#D0D5DD] bg-[#F7F8FA] text-center">
                  <UploadCloud className="w-5 h-5 text-[#0F9D91] mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-[#263445] block">
                    Upload Scan / PDF Document
                  </span>
                  <span className="text-[10px] text-[#667085]">PDF, JPG, PNG up to 10MB</span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmittingDoc}
                  className="w-full justify-center mt-2 font-bold"
                >
                  Submit for Administrator Audit
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: REVIEWS & REPUTATION (WITH REPLY CAPABILITY) */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl border border-[#E4E7EC] p-6 sm:p-8 shadow-xs max-w-4xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC]">
              <div>
                <h3 className="font-bold text-lg text-[#173B67]">Customer Feedback & Response Desk</h3>
                <p className="text-xs text-[#667085]">
                  Engage with customer reviews to build trust. All reviews stem from completed escrow appointments.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#173B67]">{workerPro.rating} ★</span>
                <span className="text-xs text-[#667085] block">{workerPro.reviewCount} total ratings</span>
              </div>
            </div>

            <div className="space-y-5">
              {workerPro.reviews.map((rev: Review) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-[#F7F8FA] border border-[#E4E7EC] space-y-3 text-xs sm:text-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#263445]">{rev.authorName}</span>
                      {rev.verifiedBooking && (
                        <span className="text-[10px] font-bold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Verified Job
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#667085]">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[#E7A83E] text-xs font-bold">
                    <span>{rev.rating} ★</span>
                    <span className="text-[#667085] font-normal">• {rev.serviceType}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#263445] leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  {/* Existing Pro Response */}
                  {rev.proResponse ? (
                    <div className="mt-2 pl-3 border-l-2 border-[#0F9D91] bg-white p-3 rounded-r-xl text-xs">
                      <span className="font-bold text-[#173B67] block mb-0.5">
                        Your Official Reply:
                      </span>
                      <p className="text-[#667085]">{rev.proResponse}</p>
                    </div>
                  ) : (
                    <div>
                      {replyingReviewId === rev.id ? (
                        <div className="mt-2 space-y-2">
                          <textarea
                            rows={2}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your public professional response..."
                            className="w-full p-2.5 rounded-xl border border-[#D0D5DD] text-xs focus:outline-none focus:ring-2 focus:ring-[#173B67]"
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleSendReply(rev.id)}
                              leftIcon={<Send className="w-3.5 h-3.5" />}
                              className="text-xs"
                            >
                              Post Reply
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setReplyingReviewId(null)}
                              className="text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingReviewId(rev.id);
                            setReplyText('');
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F9D91] hover:underline"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Reply to Customer Review</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PAYOUTS & EARNINGS */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-3xl border border-[#E4E7EC] p-6 sm:p-8 shadow-xs max-w-4xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC]">
              <div>
                <h3 className="font-bold text-lg text-[#173B67]">Earnings & Stripe Express Direct Payouts</h3>
                <p className="text-xs text-[#667085]">Escrow funds are automatically released to your connected checking account upon customer sign-off.</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#15803D] border border-emerald-200">
                Stripe Express Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E4E7EC]">
                <span className="text-xs text-[#667085]">Available for Payout</span>
                <p className="text-2xl font-black text-[#173B67] mt-1">$1,420.00</p>
                <span className="text-[11px] text-[#15803D] font-semibold mt-1 block">Scheduled for direct deposit tonight</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E4E7EC]">
                <span className="text-xs text-[#667085]">In Active Escrow</span>
                <p className="text-2xl font-black text-[#263445] mt-1">$485.00</p>
                <span className="text-[11px] text-[#667085] mt-1 block">Across 3 active dispatches</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E4E7EC]">
                <span className="text-xs text-[#667085]">YTD Gross Volume</span>
                <p className="text-2xl font-black text-[#263445] mt-1">$38,650.00</p>
                <span className="text-[11px] text-[#0F9D91] font-semibold mt-1 block">Zero lead generation fee deduction</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E4E7EC]">
              <h4 className="font-bold text-sm text-[#173B67] mb-3">Recent Payout Transactions</h4>
              <div className="divide-y divide-[#E4E7EC] text-xs">
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#263445] block">Direct Deposit #TX-9012</span>
                    <span className="text-[#667085]">Jonathan Hall • Shut-off Valves Service</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#15803D]">+$240.00</span>
                    <span className="text-[10px] text-[#667085] block">Completed Oct 5</span>
                  </div>
                </div>

                <div className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#263445] block">Direct Deposit #TX-8924</span>
                    <span className="text-[#667085]">Sarah Jenkins • Drain & P-Trap Repair</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#15803D]">+$150.00</span>
                    <span className="text-[10px] text-[#667085] block">Completed Sep 29</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
