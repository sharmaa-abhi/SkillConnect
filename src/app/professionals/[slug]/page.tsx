'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  MapPin,
  ShieldCheck,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { useProfessionalsList } from '@/lib/demo-storage';
import { RatingDisplay } from '@/components/ui/rating-display';
import { VerifiedProBadge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/professionals/favorite-button';
import { Button } from '@/components/ui/button';
import { BookingFlowDialog } from '@/components/booking/booking-flow-dialog';
import { ProfessionalCard } from '@/components/professionals/professional-card';
import { formatCurrency } from '@/lib/formatters';
import { useToast } from '@/context/toast-context';
import { Professional, ServicePriceItem, Review, WorkingHour } from '@/types/professional';

export default function ProfessionalProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { showToast } = useToast();
  const allPros = useProfessionalsList();

  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedPricingItem, setSelectedPricingItem] = useState<ServicePriceItem | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'about' | 'pricing' | 'reviews' | 'hours'>('about');

  // Find professional by slug from live custom store
  const pro = allPros.find((p: Professional) => p.slug === slug);

  if (!pro) {
    return (
      <div className="py-20 bg-[#F7F8FA]">
        <Container size="narrow" className="text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-[#E7A83E] flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#173B67]">
            Professional Not Found
          </h1>
          <p className="text-sm text-[#667085] mt-2 mb-6">
            We couldn’t find a service technician matching profile identifier &ldquo;{slug}&rdquo;. The profile may have moved or been updated.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/professionals">
              <Button variant="primary">Browse All Professionals</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Return to Homepage</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // Related professionals in same category
  const relatedPros = allPros
    .filter((p: Professional) => p.categorySlug === pro.categorySlug && p.id !== pro.id)
    .slice(0, 3);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        type: 'success',
        title: 'Profile Link Copied',
        message: 'Direct URL copied to clipboard.',
      });
    }
  };

  return (
    <div className="pb-32 lg:pb-16 bg-[#F7F8FA]">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-[#E4E7EC] py-2.5 sm:py-3 text-xs text-[#667085]">
        <Container>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-[#173B67]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/professionals" className="hover:text-[#173B67]">Professionals</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/professionals?category=${pro.categorySlug}`} className="hover:text-[#173B67]">
              {pro.categoryName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-bold text-[#173B67] truncate max-w-[140px] sm:max-w-none">{pro.name}</span>
          </div>
        </Container>
      </div>

      <Container className="pt-5 sm:pt-8">
        {/* Profile Hero Header Card */}
        <div className="bg-white rounded-3xl border border-[#E4E7EC] p-4 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              {/* Avatar Photo */}
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#173B67] flex-shrink-0 shadow-xs">
                <img
                  src={pro.avatarUrl}
                  alt={pro.name}
                  className="w-full h-full object-cover"
                />
                {pro.availableToday && (
                  <span className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 rounded-full bg-[#15803D] border-2 border-white" title="Available Today" />
                )}
              </div>

              {/* Title & Metadata */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <VerifiedProBadge />
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF1F8] text-[#173B67]">
                    {pro.categoryName}
                  </span>
                  {pro.availableToday && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#15803D] border border-emerald-200">
                      Available Today
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-[#173B67] tracking-tight">
                  {pro.name}
                </h1>
                <p className="text-sm text-[#667085] mt-0.5 font-medium">{pro.tradeTitle}</p>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#667085]">
                  <RatingDisplay rating={pro.rating} reviewCount={pro.reviewCount} size="md" />
                  <span>•</span>
                  <span>{pro.yearsInBusiness} yrs in trade</span>
                  <span>•</span>
                  <span>{pro.completedJobsCount} jobs completed</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0F9D91]" />
                    <span>{pro.serviceAreas.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Favorite & Share */}
            <div className="flex items-center gap-2 self-start">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share profile link"
                title="Share profile"
                className="p-2.5 rounded-full border border-[#E4E7EC] text-[#667085] hover:text-[#173B67] hover:bg-[#F7F8FA] transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <div className="border border-[#E4E7EC] rounded-full p-0.5">
                <FavoriteButton professionalId={pro.id} professionalName={pro.name} />
              </div>
            </div>
          </div>

          {/* Verification Strip */}
          <div className="mt-6 pt-5 border-t border-[#E4E7EC] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#263445]">
              <ShieldCheck className="w-4 h-4 text-[#0F9D91] flex-shrink-0" />
              <span><strong>License:</strong> {pro.licenseNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-[#263445]">
              <Award className="w-4 h-4 text-[#0F9D91] flex-shrink-0" />
              <span><strong>Insurance:</strong> {pro.insuranceStatus} ($2M policy)</span>
            </div>
            <div className="flex items-center gap-2 text-[#263445]">
              <Clock className="w-4 h-4 text-[#0F9D91] flex-shrink-0" />
              <span><strong>Avg Response:</strong> {pro.responseRate}</span>
            </div>
          </div>
        </div>

        {/* Two-Column Layout (Left: Tabs & Content, Right: Sticky Booking Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Left Content Area (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Tabs Header */}
            <div className="flex border-b border-[#E4E7EC] bg-white rounded-t-3xl px-6 pt-2 overflow-x-auto">
              {[
                { id: 'about', label: 'About & Credentials' },
                { id: 'pricing', label: 'Transparent Pricing' },
                { id: 'reviews', label: `Reviews (${pro.reviews.length})` },
                { id: 'hours', label: 'Working Hours' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 -mb-px transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#173B67] text-[#173B67]'
                      : 'border-transparent text-[#667085] hover:text-[#263445]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB: ABOUT & CREDENTIALS */}
            {activeTab === 'about' && (
              <div className="p-6 sm:p-8 bg-white rounded-b-3xl border border-[#E4E7EC] shadow-xs flex flex-col gap-6">
                <div>
                  <h3 className="text-base font-bold text-[#173B67] mb-2.5">
                    Background & Philosophy
                  </h3>
                  <p className="text-sm text-[#263445] leading-relaxed">
                    {pro.bio}
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#173B67] mb-3">
                    Core Skills & Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {pro.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="text-xs px-3 py-1.5 rounded-xl bg-[#EBF1F8] text-[#173B67] font-semibold border border-[#173B67]/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#173B67] mb-3">
                    Service Areas & Postal Codes Covered
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs text-[#667085]">
                    {pro.serviceAreas.map((area: string) => (
                      <span
                        key={area}
                        className="px-2.5 py-1 rounded-lg bg-[#F7F8FA] border border-[#E4E7EC] text-[#263445] font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: TRANSPARENT PRICING */}
            {activeTab === 'pricing' && (
              <div className="p-6 sm:p-8 bg-white rounded-b-3xl border border-[#E4E7EC] shadow-xs flex flex-col gap-6">
                <div className="p-4 rounded-xl bg-[#E6F7F5] border border-[#0F9D91]/25 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#0F9D91] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-[#173B67] leading-relaxed">
                    <strong>100% Credited Diagnostic Fee:</strong> When you accept the on-site quote and proceed with repair, the diagnostic fee of {formatCurrency(pro.diagnosticFee)} is credited in full toward your labor total.
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {pro.pricingItems.map((item: ServicePriceItem) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-[#E4E7EC] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-[#263445]">{item.title}</h4>
                        <p className="text-xs text-[#667085] mt-0.5">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-left sm:text-right flex-shrink-0">
                          <span className="text-base font-black text-[#173B67]">
                            {formatCurrency(item.price)}
                          </span>
                          <span className="text-xs text-[#667085] ml-1">
                            /{item.unit === 'diagnostic' ? 'diagnostic' : item.unit === 'fixed' ? 'fixed' : 'hr'}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedPricingItem(item);
                            setBookingDialogOpen(true);
                          }}
                          className="font-bold text-xs"
                        >
                          Book Service
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="p-6 sm:p-8 bg-white rounded-b-3xl border border-[#E4E7EC] shadow-xs flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC]">
                  <div>
                    <span className="text-xs text-[#667085]">Customer Satisfaction Score</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-black text-[#173B67]">
                        {pro.rating.toFixed(2)}
                      </span>
                      <RatingDisplay rating={pro.rating} showCount={false} size="lg" />
                      <span className="text-xs text-[#667085]">
                        ({pro.reviewCount} customer reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  {pro.reviews.map((rev: Review) => (
                    <div
                      key={rev.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#F7F8FA] border border-[#E4E7EC] flex flex-col gap-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#263445]">{rev.authorName}</span>
                          {rev.verifiedBooking && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified Job</span>
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#667085]">{rev.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <RatingDisplay rating={rev.rating} size="sm" showCount={false} />
                        <span className="text-xs text-[#667085] font-medium">• {rev.serviceType}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#263445] leading-relaxed">
                        &ldquo;{rev.comment}&rdquo;
                      </p>

                      {rev.proResponse && (
                        <div className="mt-2 pl-3 border-l-2 border-[#0F9D91] text-xs text-[#667085] bg-white p-2.5 rounded-r-lg">
                          <span className="font-bold text-[#173B67] block mb-0.5">
                            Response from {pro.name}:
                          </span>
                          {rev.proResponse}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: WORKING HOURS */}
            {activeTab === 'hours' && (
              <div className="p-6 sm:p-8 bg-white rounded-b-3xl border border-[#E4E7EC] shadow-xs">
                <h3 className="text-base font-bold text-[#173B67] mb-4">
                  Weekly Schedule & Dispatch Availability
                </h3>
                <div className="divide-y divide-[#E4E7EC] text-xs sm:text-sm">
                  {pro.workingHours.map((wh: WorkingHour) => (
                    <div key={wh.day} className="py-3 flex items-center justify-between">
                      <span className="font-bold text-[#263445]">{wh.day}</span>
                      <span className={wh.isAvailable ? 'text-[#173B67] font-semibold' : 'text-[#667085] italic'}>
                        {wh.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Professionals */}
            {relatedPros.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#173B67]">
                    Other Top {pro.categoryName} Specialists
                  </h3>
                  <Link
                    href={`/professionals?category=${pro.categorySlug}`}
                    className="text-xs font-bold text-[#0F9D91] hover:underline"
                  >
                    View all →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedPros.slice(0, 2).map((rp: Professional) => (
                    <ProfessionalCard key={rp.id} professional={rp} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Desktop Booking Panel (4 cols) */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E4E7EC] shadow-sm flex flex-col gap-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC]">
                <div>
                  <span className="text-xs text-[#667085] font-semibold">Standard Diagnostic Fee</span>
                  <div className="text-2xl font-black text-[#173B67] mt-0.5">
                    {formatCurrency(pro.diagnosticFee)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#667085] font-semibold">Indicative Labor Rate</span>
                  <div className="text-base font-bold text-[#263445]">
                    {formatCurrency(pro.hourlyRate)}/hr
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-[#667085]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
                  <span>100% credited toward repair labor</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
                  <span>Next available slot: {pro.availableToday ? 'Today' : 'Tomorrow'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
                  <span>Escrow hold released only upon sign-off</span>
                </div>
              </div>

              {/* Primary Booking Trigger CTA */}
              <Button
                variant="primary"
                size="lg"
                onClick={() => setBookingDialogOpen(true)}
                className="w-full justify-center font-bold text-sm shadow-xs"
              >
                Book Service Appointment
              </Button>

              <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E4E7EC] text-center text-[11px] text-[#667085]">
                Pre-authorization held in escrow • Cancel free up to 2 hrs before
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile Fixed Bottom Booking Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md px-4 py-3 sm:py-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-[#E4E7EC] z-40 shadow-2xl flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] sm:text-[11px] text-[#667085] block font-medium">Diagnostic Fee</span>
          <span className="font-black text-base sm:text-lg text-[#173B67]">
            {formatCurrency(pro.diagnosticFee)}
          </span>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setBookingDialogOpen(true)}
          className="flex-1 justify-center font-bold text-sm min-h-[44px]"
        >
          Book Appointment
        </Button>
      </div>

      {/* Multi-Step Booking Flow Modal */}
      {bookingDialogOpen && (
        <BookingFlowDialog
          isOpen={bookingDialogOpen}
          onClose={() => {
            setBookingDialogOpen(false);
            setSelectedPricingItem(undefined);
          }}
          professional={pro}
          initialServiceItem={selectedPricingItem}
        />
      )}
    </div>
  );
}
