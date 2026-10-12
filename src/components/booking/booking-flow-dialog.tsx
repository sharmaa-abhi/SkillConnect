'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Paperclip,
  AlertCircle,
  MapPin,
  User,
  Phone,
} from 'lucide-react';
import { ProfessionalProfile, ServicePriceItem } from '@/types/professional';
import { DemoBooking } from '@/types/booking';
import { Button } from '@/components/ui/button';
import { formatCurrency, generateBookingId } from '@/lib/formatters';
import { addDemoBooking } from '@/lib/demo-storage';
import { useToast } from '@/context/toast-context';
import { useAuth } from '@/context/auth-context';
import { generateBookingDateOptions } from '@/lib/dates';
import { calculateFees } from '@/lib/pricing';
import { PrototypeDisclaimer } from '@/components/ui/prototype-disclaimer';

export interface BookingFlowDialogProps {
  isOpen: boolean;
  onClose: () => void;
  professional: ProfessionalProfile;
  initialScopeDescription?: string;
  initialServiceItem?: ServicePriceItem;
}

export function BookingFlowDialog({
  isOpen,
  onClose,
  professional,
  initialScopeDescription = '',
  initialServiceItem,
}: BookingFlowDialogProps) {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [issueDescription, setIssueDescription] = useState(initialScopeDescription);
  const [selectedServiceItem, setSelectedServiceItem] = useState<ServicePriceItem | null>(
    initialServiceItem || professional.pricingItems[0] || null
  );
  const [issueError, setIssueError] = useState('');
  const [attachedPhoto, setAttachedPhoto] = useState(false);

  // Available dates dynamically derived from calendar
  const availableDates = React.useMemo(() => {
    return generateBookingDateOptions(new Date(), 5, professional.availableToday);
  }, [professional.availableToday]);

  // Date & Time State
  const [selectedDate, setSelectedDate] = useState(
    availableDates[0]?.value || 'Today'
  );
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');

  // Customer Contact State
  const [customerName, setCustomerName] = useState(user.name || 'Sarah Jenkins');
  const [customerPhone, setCustomerPhone] = useState(user.phone || '(555) 392-8172');
  const [customerAddress, setCustomerAddress] = useState(
    user.address ? `${user.address}, ${user.city || 'San Francisco'}` : '428 Castro Street, Apt 3B, San Francisco, CA'
  );

  // Confirmation State
  const [confirmedBooking, setConfirmedBooking] = useState<DemoBooking | null>(null);

  // Time Slots
  const morningSlots = ['8:00 AM', '10:00 AM', '11:30 AM'];
  const afternoonSlots = ['1:00 PM', '2:30 PM', '4:00 PM'];
  const eveningSlots = ['5:30 PM'];

  // Reset helper
  const handleClose = () => {
    setStep(1);
    setIssueDescription('');
    setIssueError('');
    setAttachedPhoto(false);
    setConfirmedBooking(null);
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Step 1 Validation
  const handleProceedToStep2 = () => {
    if (!issueDescription.trim() || issueDescription.trim().length < 8) {
      setIssueError('Please provide a brief description (at least 8 characters) of the required service.');
      return;
    }
    setIssueError('');
    setStep(2);
  };

  // Step 2 Proceed
  const handleProceedToStep3 = () => {
    setStep(3);
  };

  // Financial calculations via centralized engine
  const fees = React.useMemo(() => {
    const isFixed = selectedServiceItem && selectedServiceItem.unit === 'fixed';
    const labor = isFixed ? selectedServiceItem.price : professional.hourlyRate;
    return calculateFees({
      diagnosticFee: professional.diagnosticFee,
      hourlyRate: labor,
      estimatedHoursMin: 1.0,
      estimatedHoursMax: 2.0,
    });
  }, [professional.diagnosticFee, professional.hourlyRate, selectedServiceItem]);

  const diagnosticFee = fees.diagnosticFee;
  const estimatedLabor = selectedServiceItem && selectedServiceItem.unit === 'fixed'
    ? selectedServiceItem.price
    : professional.hourlyRate;
  const estimatedTotalLow = fees.totalMin;
  const estimatedTotalHigh = fees.totalMax;
  const estimatedTax = fees.taxAmount;

  // Step 3 Final Confirm
  const handleFinalConfirm = () => {
    const bookingId = generateBookingId();
    const newBooking: DemoBooking = {
      id: bookingId,
      createdAt: new Date().toISOString(),
      professionalId: professional.id,
      professionalName: professional.name,
      professionalTrade: professional.tradeTitle,
      professionalAvatar: professional.avatarUrl,
      categoryName: professional.categoryName,
      serviceDescription: issueDescription,
      selectedServiceTitle: selectedServiceItem?.title,
      customerName,
      customerPhone,
      customerAddress,
      appointmentDate: selectedDate,
      appointmentTime: selectedSlot,
      diagnosticFee,
      estimatedLaborRate: professional.hourlyRate,
      totalEstimateLow: estimatedTotalLow,
      totalEstimateHigh: estimatedTotalHigh,
      taxAmount: estimatedTax,
      paymentStatus: 'authorized_hold',
      status: 'pending',
      timeline: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: `Booking requested with ${professional.name}. Standard diagnostic pre-authorization of ${formatCurrency(diagnosticFee)} placed in escrow protection.`,
        },
      ],
      isDemoOnly: true,
    };

    addDemoBooking(newBooking);
    setConfirmedBooking(newBooking);
    setStep(4);

    showToast({
      type: 'success',
      title: 'Appointment Scheduled & Escrow Held',
      message: `Booking #${bookingId} confirmed for ${professional.name}.`,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
      />

      {/* Dialog Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E4E7EC] overflow-hidden flex flex-col max-h-[92dvh]"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E4E7EC] bg-[#F7F8FA]">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#173B67] text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
              {professional.name[0]}
            </div>
            <div className="min-w-0">
              <h2 id="booking-modal-title" className="text-sm sm:text-base font-bold text-[#173B67] truncate">
                Schedule Service Appointment
              </h2>
              <p className="text-[11px] sm:text-xs text-[#667085] truncate">
                With {professional.name} • {professional.tradeTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close booking dialog"
            className="p-1.5 rounded-xl text-[#667085] hover:text-[#263445] hover:bg-[#EBF1F8] transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 bg-white border-b border-[#E4E7EC] text-xs">
          {[
            { num: 1, label: 'Scope & Service' },
            { num: 2, label: 'Date & Time' },
            { num: 3, label: 'Pricing & Escrow' },
            { num: 4, label: 'Confirmed' },
          ].map((item) => (
            <div key={item.num} className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === item.num
                    ? 'bg-[#173B67] text-white'
                    : step > item.num
                    ? 'bg-[#E6F7F5] text-[#0F9D91]'
                    : 'bg-[#F7F8FA] text-[#667085] border border-[#E4E7EC]'
                }`}
              >
                {step > item.num ? '✓' : item.num}
              </span>
              <span
                className={`hidden sm:inline font-semibold ${
                  step === item.num ? 'text-[#173B67]' : 'text-[#667085]'
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Dynamic Step Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: SERVICE SCOPE & ITEM */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              {/* Select Service Item if Pro offers multiple */}
              {professional.pricingItems.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-[#263445] uppercase tracking-wider mb-2">
                    Select Target Service Task:
                  </label>
                  <div className="flex flex-col gap-2">
                    {professional.pricingItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedServiceItem(item)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                          selectedServiceItem?.id === item.id
                            ? 'bg-[#EBF1F8] border-[#173B67] shadow-2xs'
                            : 'bg-white border-[#E4E7EC] hover:bg-[#F7F8FA]'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-[#263445]">{item.title}</p>
                          <p className="text-[11px] text-[#667085] line-clamp-1">{item.description}</p>
                        </div>
                        <span className="text-xs font-bold text-[#173B67] whitespace-nowrap">
                          {formatCurrency(item.price)}
                          <span className="text-[10px] text-[#667085] font-normal">/{item.unit}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="issue-description"
                  className="block text-xs font-bold text-[#263445] uppercase tracking-wider mb-1.5"
                >
                  Describe the service required or issue: <span className="text-[#B42318]">*</span>
                </label>
                <textarea
                  id="issue-description"
                  rows={3}
                  value={issueDescription}
                  onChange={(e) => {
                    setIssueDescription(e.target.value);
                    if (issueError) setIssueError('');
                  }}
                  placeholder="e.g. Kitchen sink drain backed up, leaking shutoff valve underneath, water heater making loud knocking noises..."
                  className={`w-full p-3.5 text-sm rounded-xl border ${
                    issueError
                      ? 'border-[#B42318] focus:ring-2 focus:ring-[#B42318]'
                      : 'border-[#D0D5DD] focus:ring-2 focus:ring-[#173B67]'
                  } focus:outline-none transition-all placeholder:text-[#667085]/70`}
                />
                {issueError && (
                  <p className="text-xs text-[#B42318] mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{issueError}</span>
                  </p>
                )}
                <p className="text-xs text-[#667085] mt-1">
                  Help {professional.name} arrive with the exact fixtures and diagnostic tools required.
                </p>
              </div>

              {/* Photo Upload Simulation */}
              <div className="p-3.5 rounded-xl border border-dashed border-[#D0D5DD] bg-[#F7F8FA]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white border border-[#E4E7EC] text-[#0F9D91]">
                      <Paperclip className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#263445]">
                        Attach photo or video (Optional)
                      </p>
                      <p className="text-[11px] text-[#667085]">
                        Helps the technician evaluate required parts in advance.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedPhoto(!attachedPhoto);
                      showToast({
                        type: 'info',
                        title: attachedPhoto ? 'Attachment Removed' : 'Sample Photo Attached',
                        message: attachedPhoto ? 'Attachment removed' : 'fixture_leak_overview.jpg (1.8 MB)',
                      });
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors border ${
                      attachedPhoto
                        ? 'bg-[#E6F7F5] text-[#0F9D91] border-[#0F9D91]/30'
                        : 'bg-white text-[#263445] border-[#E4E7EC] hover:bg-gray-50'
                    }`}
                  >
                    {attachedPhoto ? 'Attached: photo.jpg' : 'Attach Photo'}
                  </button>
                </div>
              </div>

              {/* Service Address & Customer Details */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E4E7EC] text-xs text-[#263445]">
                    <User className="w-3.5 h-3.5 text-[#0F9D91] flex-shrink-0" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-1">
                    Contact Phone
                  </label>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E4E7EC] text-xs text-[#263445]">
                    <Phone className="w-3.5 h-3.5 text-[#0F9D91] flex-shrink-0" />
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-1">
                    Service Address
                  </label>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E4E7EC] text-xs text-[#263445]">
                    <MapPin className="w-3.5 h-3.5 text-[#0F9D91] flex-shrink-0" />
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME SELECTION */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold text-[#263445] uppercase tracking-wider mb-2.5">
                  Select Preferred Date:
                </label>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2">
                  {availableDates.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      disabled={!d.available}
                      onClick={() => setSelectedDate(d.value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        selectedDate === d.value
                          ? 'bg-[#173B67] text-white border-[#173B67] shadow-xs'
                          : d.available
                          ? 'bg-white border-[#E4E7EC] text-[#263445] hover:bg-[#EBF1F8]'
                          : 'bg-[#F7F8FA] border-[#E4E7EC] text-[#667085]/50 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <span className="text-xs font-bold">{d.label}</span>
                      <span className="text-[11px] opacity-80">{d.subtext}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots Selection */}
              <div>
                <label className="block text-xs font-bold text-[#263445] uppercase tracking-wider mb-2.5">
                  Select Arrival Window:
                </label>

                <div className="flex flex-col gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider block mb-1.5">
                      Morning Arrival
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {morningSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                            selectedSlot === slot
                              ? 'bg-[#0F9D91] text-white border-[#0F9D91]'
                              : 'bg-white border-[#E4E7EC] text-[#263445] hover:bg-[#F7F8FA]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider block mb-1.5">
                      Afternoon Arrival
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {afternoonSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                            selectedSlot === slot
                              ? 'bg-[#0F9D91] text-white border-[#0F9D91]'
                              : 'bg-white border-[#E4E7EC] text-[#263445] hover:bg-[#F7F8FA]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider block mb-1.5">
                      Evening Arrival
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {eveningSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                            selectedSlot === slot
                              ? 'bg-[#0F9D91] text-white border-[#0F9D91]'
                              : 'bg-white border-[#E4E7EC] text-[#263445] hover:bg-[#F7F8FA]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ESTIMATE & DISCLOSURES */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <PrototypeDisclaimer variant="card" />

              <div className="p-4 rounded-xl bg-[#E6F7F5] border border-[#0F9D91]/30">
                <div className="flex items-center gap-2 text-[#173B67] font-bold text-sm mb-1">
                  <ShieldCheck className="w-5 h-5 text-[#0F9D91]" />
                  <span>Transparent Upfront Pricing & Escrow Hold</span>
                </div>
                <p className="text-xs text-[#263445]/90 leading-relaxed">
                  Only the standard diagnostic fee ({formatCurrency(diagnosticFee)}) is pre-authorized in escrow today. If you authorize the repair quote on-site, this fee is credited 100% toward your labor bill.
                </p>
              </div>

              {/* Itemized Estimate Table */}
              <div className="rounded-xl border border-[#E4E7EC] overflow-hidden text-xs sm:text-sm">
                <div className="bg-[#F7F8FA] px-4 py-2.5 border-b border-[#E4E7EC] text-[11px] font-bold text-[#173B67] uppercase tracking-wider">
                  Pre-Authorization Breakdown
                </div>
                <div className="p-4 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-[#263445]">
                    <div>
                      <span className="font-semibold">Standard Diagnostic Inspection Fee</span>
                      <p className="text-xs text-[#667085]">100% credited toward repair labor</p>
                    </div>
                    <span className="font-bold text-[#173B67]">
                      {formatCurrency(diagnosticFee)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#263445] pt-2 border-t border-[#E4E7EC]">
                    <div>
                      <span className="font-semibold">Selected Scope Target</span>
                      <p className="text-xs text-[#667085]">
                        {selectedServiceItem?.title || professional.tradeTitle}
                      </p>
                    </div>
                    <span className="font-semibold text-[#263445]">
                      {formatCurrency(professional.hourlyRate)}/hr est.
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#263445] pt-2 border-t border-[#E4E7EC]">
                    <div>
                      <span className="font-semibold">Estimated Local Sales Tax</span>
                      <p className="text-xs text-[#667085]">8.75% municipal diagnostic tax</p>
                    </div>
                    <span className="font-medium text-[#667085]">
                      {formatCurrency(estimatedTax)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#263445] pt-2 border-t border-[#E4E7EC]">
                    <div>
                      <span className="font-semibold">SkillConnect Trust & Escrow Fee</span>
                      <p className="text-xs text-[#667085]">$2,500 workmanship craftsmanship guarantee</p>
                    </div>
                    <span className="font-bold text-[#15803D]">
                      $0.00 (Free for Homeowners)
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-[#E4E7EC] font-bold text-base text-[#173B67]">
                    <span>Initial Escrow Pre-Authorization</span>
                    <span>{formatCurrency(diagnosticFee + estimatedTax)}</span>
                  </div>
                </div>
              </div>

              {/* Appointment summary recap */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E4E7EC] text-xs text-[#263445]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0F9D91]" />
                  <span className="font-semibold">{selectedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0F9D91]" />
                  <span className="font-semibold">{selectedSlot}</span>
                </div>
              </div>

              {/* Cancellation Policy Disclosure */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-[#667085] leading-relaxed">
                <strong>Cancellation Policy:</strong> Free cancellation up to 2 hours before the scheduled arrival window with 100% immediate release of your escrow pre-authorization.
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION */}
          {step === 4 && confirmedBooking && (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#E6F7F5] text-[#0F9D91] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="text-xs font-bold tracking-widest text-[#0F9D91] uppercase mb-1">
                Booking Confirmed & Escrow Pre-Authorized
              </span>
              <h3 className="text-2xl font-bold text-[#173B67] mb-1">
                You’re All Set!
              </h3>
              <p className="text-xs text-[#667085] mb-6">
                Booking Reference: <strong className="text-[#173B67] font-mono text-sm">{confirmedBooking.id}</strong>
              </p>

              {/* Booking Summary Box */}
              <div className="w-full text-left p-4 rounded-2xl bg-[#F7F8FA] border border-[#E4E7EC] text-sm flex flex-col gap-2.5 mb-6">
                <div className="flex justify-between items-center pb-2 border-b border-[#E4E7EC]">
                  <span className="text-xs text-[#667085]">Technician</span>
                  <span className="font-bold text-[#263445]">{confirmedBooking.professionalName}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#E4E7EC]">
                  <span className="text-xs text-[#667085]">Trade Specialty</span>
                  <span className="font-semibold text-[#263445]">{confirmedBooking.professionalTrade}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#E4E7EC]">
                  <span className="text-xs text-[#667085]">Arrival Window</span>
                  <span className="font-bold text-[#173B67]">{confirmedBooking.appointmentDate} at {confirmedBooking.appointmentTime}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#E4E7EC]">
                  <span className="text-xs text-[#667085]">Service Address</span>
                  <span className="font-medium text-[#263445] text-xs text-right max-w-xs">{confirmedBooking.customerAddress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#667085]">Diagnostic Escrow Hold</span>
                  <span className="font-bold text-[#173B67]">{formatCurrency(confirmedBooking.diagnosticFee)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex flex-col sm:flex-row gap-3">
                <Link href="/customer/dashboard" onClick={onClose} className="flex-1">
                  <Button variant="primary" className="w-full justify-center">
                    View in Customer Dashboard
                  </Button>
                </Link>
                <Button variant="outline" onClick={onClose} className="flex-1 justify-center">
                  Done / Browse Marketplace
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions (Steps 1 to 3) */}
        {step < 4 && (
          <div className="p-4 px-6 border-t border-[#E4E7EC] bg-[#F7F8FA] flex items-center justify-between">
            {step > 1 ? (
              <Button
                variant="outline"
                size="md"
                onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
            ) : (
              <Button variant="ghost" size="md" onClick={onClose}>
                Cancel
              </Button>
            )}

            {step === 1 && (
              <Button
                variant="primary"
                size="md"
                onClick={handleProceedToStep2}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Time Slots
              </Button>
            )}

            {step === 2 && (
              <Button
                variant="primary"
                size="md"
                onClick={handleProceedToStep3}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Review Pricing & Escrow
              </Button>
            )}

            {step === 3 && (
              <Button
                variant="primary"
                size="md"
                onClick={handleFinalConfirm}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Confirm Appointment & Hold Escrow
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
