'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
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
  FileCheck2,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { ProfessionalProfile } from '@/types/professional';
import { DemoBooking } from '@/types/booking';
import { Button } from '@/components/ui/button';
import { formatCurrency, generateBookingId } from '@/lib/formatters';
import { addDemoBooking } from '@/lib/demo-storage';
import { useToast } from '@/context/toast-context';

export interface BookingFlowDialogProps {
  isOpen: boolean;
  onClose: () => void;
  professional: ProfessionalProfile;
}

export function BookingFlowDialog({
  isOpen,
  onClose,
  professional,
}: BookingFlowDialogProps) {
  const { showToast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [issueDescription, setIssueDescription] = useState('');
  const [issueError, setIssueError] = useState('');
  const [attachedPhoto, setAttachedPhoto] = useState(false);

  // Date & Time State
  const [selectedDate, setSelectedDate] = useState('Tomorrow, Oct 6');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');

  // Customer Contact State (Demo)
  const [customerName, setCustomerName] = useState('Sarah Jenkins');
  const [customerAddress, setCustomerAddress] = useState('428 Castro Street, Apt 3B, San Francisco, CA');

  // Confirmation State
  const [confirmedBooking, setConfirmedBooking] = useState<DemoBooking | null>(null);

  // Available dates for sample
  const availableDates = [
    { label: 'Today', subtext: 'Oct 5', value: 'Today, Oct 5', available: professional.availableToday },
    { label: 'Tomorrow', subtext: 'Oct 6', value: 'Tomorrow, Oct 6', available: true },
    { label: 'Wednesday', subtext: 'Oct 7', value: 'Wednesday, Oct 7', available: true },
    { label: 'Thursday', subtext: 'Oct 8', value: 'Thursday, Oct 8', available: true },
    { label: 'Friday', subtext: 'Oct 9', value: 'Friday, Oct 9', available: true },
  ];

  // Time Slots
  const morningSlots = ['8:00 AM', '10:00 AM', '11:30 AM'];
  const afternoonSlots = ['1:00 PM', '2:30 PM', '4:00 PM'];
  const eveningSlots = ['5:30 PM'];

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIssueDescription('');
      setIssueError('');
      setAttachedPhoto(false);
      setConfirmedBooking(null);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
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
    if (!issueDescription.trim() || issueDescription.trim().length < 10) {
      setIssueError('Please provide a brief description (at least 10 characters) of the issue.');
      return;
    }
    setIssueError('');
    setStep(2);
  };

  // Step 2 Proceed
  const handleProceedToStep3 = () => {
    setStep(3);
  };

  // Step 3 Confirm
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
      customerName,
      customerAddress,
      appointmentDate: selectedDate,
      appointmentTime: selectedSlot,
      diagnosticFee: professional.diagnosticFee,
      estimatedLaborRate: professional.hourlyRate,
      totalEstimateLow: professional.diagnosticFee,
      totalEstimateHigh: professional.diagnosticFee + professional.hourlyRate,
      status: 'confirmed',
      isDemoOnly: true,
    };

    addDemoBooking(newBooking);
    setConfirmedBooking(newBooking);
    setStep(4);

    showToast({
      type: 'success',
      title: 'Appointment Scheduled (Demo)',
      message: `Booking #${bookingId} recorded for ${professional.name}.`,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
      />

      {/* Dialog Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#e3e8e3] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-[#e3e8e3] bg-[#f8f8f4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#143d35] text-white flex items-center justify-center font-bold text-sm">
              {professional.name[0]}
            </div>
            <div>
              <h2 id="booking-modal-title" className="text-base font-bold text-[#172522]">
                Book Demo Appointment
              </h2>
              <p className="text-xs text-[#66716d]">
                With {professional.name} • {professional.tradeTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking dialog"
            className="p-1.5 rounded-xl text-[#66716d] hover:text-[#172522] hover:bg-[#e7f4ed]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#e3e8e3] text-xs">
          {[
            { num: 1, label: 'Scope' },
            { num: 2, label: 'Date & Time' },
            { num: 3, label: 'Estimate' },
            { num: 4, label: 'Confirmed' },
          ].map((item) => (
            <div key={item.num} className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  step === item.num
                    ? 'bg-[#237a63] text-white'
                    : step > item.num
                    ? 'bg-[#e7f4ed] text-[#143d35]'
                    : 'bg-[#f8f8f4] text-[#66716d] border border-[#e3e8e3]'
                }`}
              >
                {step > item.num ? '✓' : item.num}
              </span>
              <span
                className={`hidden sm:inline font-medium ${
                  step === item.num ? 'text-[#143d35] font-bold' : 'text-[#66716d]'
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Dynamic Step Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: SERVICE SCOPE */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="issue-description"
                  className="block text-sm font-semibold text-[#172522] mb-1.5"
                >
                  Describe the service needed or problem: <span className="text-[#b42318]">*</span>
                </label>
                <textarea
                  id="issue-description"
                  rows={4}
                  value={issueDescription}
                  onChange={(e) => {
                    setIssueDescription(e.target.value);
                    if (issueError) setIssueError('');
                  }}
                  placeholder="e.g. Kitchen sink drain is completely backed up. Standing water for 24 hours. Need emergency inspection and clearing."
                  className={`w-full p-3.5 text-sm rounded-xl border ${
                    issueError
                      ? 'border-[#b42318] focus:ring-2 focus:ring-[#b42318]'
                      : 'border-[#c8d3cc] focus:ring-2 focus:ring-[#237a63]'
                  } focus:outline-none transition-all placeholder:text-[#66716d]/70`}
                />
                {issueError && (
                  <p className="text-xs text-[#b42318] mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{issueError}</span>
                  </p>
                )}
                <p className="text-xs text-[#66716d] mt-1">
                  Provide clear details so {professional.name} arrives with the right tools and fittings.
                </p>
              </div>

              {/* Photo Upload Simulation */}
              <div className="p-4 rounded-xl border border-dashed border-[#c8d3cc] bg-[#f8f8f4]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white border border-[#e3e8e3] text-[#237a63]">
                      <Paperclip className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#172522]">
                        Attach photo or video (Optional)
                      </p>
                      <p className="text-[11px] text-[#66716d]">
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
                        message: attachedPhoto ? 'Mock photo removed' : 'sink_leak_overview.jpg (1.8 MB)',
                      });
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border ${
                      attachedPhoto
                        ? 'bg-[#e7f4ed] text-[#143d35] border-[#237a63]/30'
                        : 'bg-white text-[#172522] border-[#e3e8e3] hover:bg-gray-50'
                    }`}
                  >
                    {attachedPhoto ? 'Attached: photo.jpg' : 'Simulate Upload'}
                  </button>
                </div>
              </div>

              {/* Service Location */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#66716d] uppercase tracking-wider mb-1">
                  Service Address (Demo Sample)
                </label>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[#e3e8e3] text-sm text-[#172522]">
                  <MapPin className="w-4 h-4 text-[#237a63] flex-shrink-0" />
                  <span className="truncate">{customerAddress}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME SELECTION */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-semibold text-[#172522] mb-2.5">
                  Select Preferred Date:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {availableDates.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      disabled={!d.available}
                      onClick={() => setSelectedDate(d.value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        selectedDate === d.value
                          ? 'bg-[#143d35] text-white border-[#143d35] shadow-sm'
                          : d.available
                          ? 'bg-white border-[#e3e8e3] text-[#172522] hover:bg-[#e7f4ed]'
                          : 'bg-[#f8f8f4] border-[#e3e8e3] text-[#66716d]/50 cursor-not-allowed opacity-60'
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
                <label className="block text-sm font-semibold text-[#172522] mb-2.5">
                  Select Arrival Window:
                </label>

                <div className="flex flex-col gap-3">
                  <div>
                    <span className="text-xs font-semibold text-[#66716d] uppercase tracking-wider block mb-1.5">
                      Morning
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {morningSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                            selectedSlot === slot
                              ? 'bg-[#237a63] text-white border-[#237a63]'
                              : 'bg-white border-[#e3e8e3] text-[#172522] hover:bg-[#f8f8f4]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-[#66716d] uppercase tracking-wider block mb-1.5">
                      Afternoon
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {afternoonSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                            selectedSlot === slot
                              ? 'bg-[#237a63] text-white border-[#237a63]'
                              : 'bg-white border-[#e3e8e3] text-[#172522] hover:bg-[#f8f8f4]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-[#66716d] uppercase tracking-wider block mb-1.5">
                      Evening
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {eveningSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                            selectedSlot === slot
                              ? 'bg-[#237a63] text-white border-[#237a63]'
                              : 'bg-white border-[#e3e8e3] text-[#172522] hover:bg-[#f8f8f4]'
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
              <div className="p-4 rounded-xl bg-[#e7f4ed] border border-[#237a63]/20">
                <div className="flex items-center gap-2 text-[#143d35] font-semibold text-sm mb-1">
                  <ShieldCheck className="w-5 h-5 text-[#237a63]" />
                  <span>Transparent Upfront Pricing</span>
                </div>
                <p className="text-xs text-[#143d35]/90 leading-relaxed">
                  A standard diagnostic fee applies to evaluate the issue on-site. If you proceed with the recommended repair, this fee is credited 100% toward your labor total.
                </p>
              </div>

              {/* Itemized Estimate Table */}
              <div className="rounded-xl border border-[#e3e8e3] overflow-hidden">
                <div className="bg-[#f8f8f4] px-4 py-2.5 border-b border-[#e3e8e3] text-xs font-bold text-[#172522] uppercase tracking-wider">
                  Estimate Breakdown
                </div>
                <div className="p-4 flex flex-col gap-3 text-sm">
                  <div className="flex justify-between items-center text-[#172522]">
                    <div>
                      <span className="font-semibold">Standard Diagnostic Inspection</span>
                      <p className="text-xs text-[#66716d]">Credited 100% toward accepted repair labor</p>
                    </div>
                    <span className="font-bold text-[#143d35]">
                      {formatCurrency(professional.diagnosticFee)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#172522] pt-2 border-t border-[#e3e8e3]">
                    <div>
                      <span className="font-semibold">Indicative Labor Rate</span>
                      <p className="text-xs text-[#66716d]">Standard rate for trade specialist</p>
                    </div>
                    <span className="font-bold text-[#172522]">
                      {formatCurrency(professional.hourlyRate)}/hr
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-[#e3e8e3] font-bold text-base text-[#143d35]">
                    <span>Estimated Total Range</span>
                    <span>
                      {formatCurrency(professional.diagnosticFee)} –{' '}
                      {formatCurrency(professional.diagnosticFee + professional.hourlyRate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Appointment summary recap */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#e3e8e3] text-xs text-[#172522]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#237a63]" />
                  <span>{selectedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#237a63]" />
                  <span>{selectedSlot}</span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Prototype Notice:</strong> Demo only — no real technician has been dispatched, and no payment has been processed.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION */}
          {step === 4 && confirmedBooking && (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#e7f4ed] text-[#237a63] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="text-xs font-bold tracking-widest text-[#237a63] uppercase mb-1">
                Demo Booking Confirmed
              </span>
              <h3 className="text-2xl font-bold text-[#172522] mb-1">
                You’re All Set!
              </h3>
              <p className="text-xs text-[#66716d] mb-6">
                Appointment Reference Code: <strong className="text-[#143d35] font-mono text-sm">{confirmedBooking.id}</strong>
              </p>

              {/* Booking Summary Box */}
              <div className="w-full text-left p-4 rounded-2xl bg-[#f8f8f4] border border-[#e3e8e3] text-sm flex flex-col gap-2.5 mb-6">
                <div className="flex justify-between items-center pb-2 border-b border-[#e3e8e3]">
                  <span className="text-xs text-[#66716d]">Professional</span>
                  <span className="font-bold text-[#172522]">{confirmedBooking.professionalName}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#e3e8e3]">
                  <span className="text-xs text-[#66716d]">Trade Specialty</span>
                  <span className="font-semibold text-[#172522]">{confirmedBooking.professionalTrade}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#e3e8e3]">
                  <span className="text-xs text-[#66716d]">Scheduled Arrival</span>
                  <span className="font-bold text-[#143d35]">{confirmedBooking.appointmentDate} at {confirmedBooking.appointmentTime}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#e3e8e3]">
                  <span className="text-xs text-[#66716d]">Address</span>
                  <span className="font-medium text-[#172522] text-xs text-right max-w-xs">{confirmedBooking.customerAddress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#66716d]">Diagnostic Fee</span>
                  <span className="font-bold text-[#143d35]">{formatCurrency(confirmedBooking.diagnosticFee)}</span>
                </div>
              </div>

              {/* Explicit Disclaimer */}
              <div className="w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed mb-6">
                Demo only — no real professional has been contacted and no appointment has been booked. This booking has been saved to your local session.
              </div>

              {/* Action Buttons */}
              <div className="w-full flex flex-col sm:flex-row gap-3">
                <Link href="/customer/dashboard" onClick={onClose} className="flex-1">
                  <Button variant="primary" className="w-full justify-center">
                    View in Customer Dashboard
                  </Button>
                </Link>
                <Button variant="outline" onClick={onClose} className="flex-1 justify-center">
                  Done / Browse More
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions (Steps 1 to 3) */}
        {step < 4 && (
          <div className="p-4 px-6 border-t border-[#e3e8e3] bg-[#f8f8f4] flex items-center justify-between">
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
                Review Estimate
              </Button>
            )}

            {step === 3 && (
              <Button
                variant="primary"
                size="md"
                onClick={handleFinalConfirm}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Confirm Demo Booking
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
