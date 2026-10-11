'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { Professional } from '@/types/professional';
import { RatingDisplay } from '@/components/ui/rating-display';
import { VerifiedProBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatters';

export interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedPros: Professional[];
  onRemovePro: (proId: string) => void;
  onClearAll: () => void;
  onBookPro: (pro: Professional) => void;
}

export function ComparisonModal({
  isOpen,
  onClose,
  comparedPros,
  onRemovePro,
  onClearAll,
  onBookPro,
}: ComparisonModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 lg:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-modal-title"
    >
      <div className="bg-white w-full max-w-5xl rounded-2xl sm:rounded-3xl border border-[#E4E7EC] shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-[#173B67] text-white flex items-center justify-between gap-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F9D91] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="comparison-modal-title" className="text-lg sm:text-xl font-black text-white">
                  Compare Service Specialists
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">
                  {comparedPros.length}/3 Selected
                </span>
              </div>
              <p className="text-xs text-white/80 hidden sm:block mt-0.5">
                Evaluate upfront diagnostic fees, hourly rates, state credentials, and response speeds side-by-side.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedPros.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-semibold text-white/70 hover:text-white px-2.5 py-1.5 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-1"
                title="Clear all compared pros"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close comparison dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F7F8FA]">
          {comparedPros.length === 0 ? (
            <div className="py-16 text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#EBF1F8] text-[#173B67] flex items-center justify-center mx-auto mb-3">
                <Scale className="w-7 h-7 text-[#0F9D91]" />
              </div>
              <h3 className="text-base font-bold text-[#173B67]">No Specialists Selected</h3>
              <p className="text-xs text-[#667085] mt-1 mb-5 leading-relaxed">
                Tap the &ldquo;+ Compare&rdquo; button on any 2 or 3 contractor cards in the directory to inspect their diagnostic pricing and credentials side-by-side.
              </p>
              <Button variant="primary" size="sm" onClick={onClose}>
                Browse Directory to Select Pros
              </Button>
            </div>
          ) : (
            <div>
              {comparedPros.length === 1 && (
                <div className="mb-4 p-3 rounded-2xl bg-[#E6F7F5] border border-[#0F9D91]/30 flex items-center justify-between gap-3 text-xs text-[#173B67]">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#0F9D91] shrink-0" />
                    <span>Select at least 1 more specialist from the directory to enable full side-by-side comparison.</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={onClose} className="shrink-0 text-xs py-1">
                    + Add Another Pro
                  </Button>
                </div>
              )}

              {/* Comparison Matrix Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comparedPros.map((pro) => (
                  <div
                    key={pro.id}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-[#E4E7EC] shadow-xs flex flex-col justify-between overflow-hidden relative"
                  >
                    {/* Card Header */}
                    <div className="p-4 sm:p-5 border-b border-[#E4E7EC] bg-gradient-to-b from-[#F7F8FA] to-white relative">
                      <button
                        type="button"
                        onClick={() => onRemovePro(pro.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-full text-[#667085] hover:text-[#B42318] hover:bg-red-50 transition-colors"
                        title={`Remove ${pro.name} from comparison`}
                        aria-label={`Remove ${pro.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-3 pr-6">
                        <img
                          src={pro.avatarUrl}
                          alt={pro.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-[#E4E7EC] shadow-2xs shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F9D91]">
                            {pro.categoryName}
                          </span>
                          <h4 className="font-bold text-sm sm:text-base text-[#173B67] truncate">
                            {pro.name}
                          </h4>
                          <p className="text-[11px] text-[#667085] truncate">{pro.tradeTitle}</p>
                          <div className="mt-1">
                            <RatingDisplay rating={pro.rating} reviewCount={pro.reviewCount} size="sm" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comparative Attributes List */}
                    <div className="p-4 sm:p-5 divide-y divide-[#E4E7EC] text-xs flex-1 flex flex-col justify-between gap-3">
                      {/* Diagnostic Fee */}
                      <div className="flex items-center justify-between pb-2.5">
                        <span className="text-[#667085] font-medium">Diagnostic Fee</span>
                        <div className="text-right">
                          <span className="font-black text-[#173B67] text-sm sm:text-base">
                            {formatCurrency(pro.diagnosticFee)}
                          </span>
                          <span className="block text-[10px] text-[#15803D] font-bold">
                            100% Credited to Labor
                          </span>
                        </div>
                      </div>

                      {/* Hourly Rate */}
                      <div className="flex items-center justify-between py-2.5">
                        <span className="text-[#667085] font-medium">Hourly Labor Rate</span>
                        <span className="font-extrabold text-[#263445] text-sm">
                          {formatCurrency(pro.hourlyRate)}/hr
                        </span>
                      </div>

                      {/* Availability */}
                      <div className="flex items-center justify-between py-2.5">
                        <span className="text-[#667085] font-medium">Availability</span>
                        {pro.availableToday ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-[#15803D] border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" />
                            Available Today
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#667085] font-medium">
                            Next Business Day
                          </span>
                        )}
                      </div>

                      {/* License Verification */}
                      <div className="flex items-start justify-between py-2.5">
                        <span className="text-[#667085] font-medium">State Trade License</span>
                        <div className="text-right">
                          <span className="font-mono text-[11px] font-bold text-[#173B67] block">
                            {pro.licenseNumber}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0F9D91]">
                            <ShieldCheck className="w-3 h-3" />
                            Verified Active
                          </span>
                        </div>
                      </div>

                      {/* Insurance Policy */}
                      <div className="flex items-center justify-between py-2.5">
                        <span className="text-[#667085] font-medium">Liability Insurance</span>
                        <span className="font-semibold text-[#173B67] text-[11px] flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-[#0F9D91]" />
                          $2M Commercial
                        </span>
                      </div>

                      {/* Experience & Completed Jobs */}
                      <div className="flex items-center justify-between py-2.5">
                        <span className="text-[#667085] font-medium">Track Record</span>
                        <span className="font-semibold text-[#263445]">
                          {pro.yearsInBusiness} yrs • {pro.completedJobsCount} jobs
                        </span>
                      </div>

                      {/* Response Time */}
                      <div className="flex items-center justify-between py-2.5">
                        <span className="text-[#667085] font-medium">Avg Response</span>
                        <span className="font-bold text-[#173B67] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#0F9D91]" />
                          {pro.responseRate}
                        </span>
                      </div>

                      {/* Service Areas */}
                      <div className="py-2.5">
                        <span className="text-[#667085] font-medium block mb-1">Service Areas</span>
                        <div className="flex items-center gap-1 text-[#263445] text-[11px]">
                          <MapPin className="w-3 h-3 text-[#0F9D91] shrink-0" />
                          <span className="truncate">{pro.serviceAreas.join(', ')}</span>
                        </div>
                      </div>

                      {/* Top Skills */}
                      <div className="pt-2.5">
                        <span className="text-[#667085] font-medium block mb-1.5">Specialties</span>
                        <div className="flex flex-wrap gap-1">
                          {pro.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-[#F7F8FA] text-[#173B67] border border-[#E4E7EC]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Action Footer */}
                    <div className="p-4 sm:p-5 bg-[#F7F8FA] border-t border-[#E4E7EC] flex flex-col gap-2">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => {
                          onClose();
                          onBookPro(pro);
                        }}
                        className="w-full justify-center font-bold text-xs sm:text-sm shadow-xs"
                      >
                        <span>Book with {pro.name.split(' ')[0]}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                      <Link
                        href={`/professionals/${pro.slug}`}
                        onClick={onClose}
                        className="text-center text-[11px] font-bold text-[#173B67] hover:text-[#0F9D91] transition-colors py-1"
                      >
                        View Full Profile & Reviews →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#E4E7EC] flex items-center justify-between text-xs text-[#667085] shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0F9D91] shrink-0" />
            <span className="text-[11px] sm:text-xs">
              All listed pros adhere to SkillConnect upfront diagnostic fee credit and $2,500 escrow craftsmanship warranty.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-[#173B67] hover:underline shrink-0 ml-3"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
