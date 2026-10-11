'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, Scale } from 'lucide-react';
import { ProfessionalProfile } from '@/types/professional';
import { RatingDisplay } from '@/components/ui/rating-display';
import { PriceLabel } from '@/components/ui/price-label';
import { VerifiedProBadge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/professionals/favorite-button';
import { useComparison, toggleComparisonPro } from '@/lib/demo-storage';
import { useToast } from '@/context/toast-context';

export interface ProfessionalCardProps {
  professional: ProfessionalProfile;
  className?: string;
}

export function ProfessionalCard({ professional, className = '' }: ProfessionalCardProps) {
  const [imgError, setImgError] = useState(false);
  const comparisonIds = useComparison();
  const { showToast } = useToast();
  const isCompared = comparisonIds.includes(professional.id);

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleComparisonPro(professional.id);
    if (result.error) {
      showToast({
        type: 'error',
        title: 'Comparison Limit Reached',
        message: result.error,
      });
    } else if (result.isAdded) {
      showToast({
        type: 'success',
        title: 'Added to Comparison',
        message: `${professional.name} added to side-by-side comparison (${result.count}/3).`,
      });
    } else {
      showToast({
        type: 'info',
        title: 'Removed from Comparison',
        message: `${professional.name} removed from comparison.`,
      });
    }
  };

  const initials = professional.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  return (
    <div
      className={`group flex flex-col bg-white rounded-3xl border border-[#E4E7EC] hover:border-[#D0D5DD] shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden ${className}`}
    >
      {/* Top Image & Badges */}
      <div className="relative w-full h-48 bg-[#173B67] overflow-hidden">
        {!imgError ? (
          <img
            src={professional.avatarUrl}
            alt={professional.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#173B67] text-white">
            <span className="text-3xl font-bold tracking-wider">{initials}</span>
          </div>
        )}

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto">
            {professional.verifiedPro && <VerifiedProBadge />}
          </div>
          <div className="pointer-events-auto">
            <FavoriteButton
              professionalId={professional.id}
              professionalName={professional.name}
            />
          </div>
        </div>

        {/* Available Today Pill */}
        {professional.availableToday && (
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#173B67]/90 text-white backdrop-blur-md border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D91] animate-pulse" />
              Available Today
            </span>
          </div>
        )}

        {/* Compare Toggle Pill */}
        <div className="absolute bottom-3 right-3 pointer-events-auto">
          <button
            type="button"
            onClick={handleToggleCompare}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md transition-all shadow-xs min-h-[28px] active:scale-95 ${
              isCompared
                ? 'bg-[#0F9D91] text-white border border-white/40'
                : 'bg-white/90 hover:bg-white text-[#173B67] border border-white/60'
            }`}
            aria-label={`${isCompared ? 'Remove' : 'Add'} ${professional.name} to side-by-side comparison`}
            title={isCompared ? 'Click to remove from comparison' : 'Compare side-by-side with other pros'}
          >
            <Scale className="w-3 h-3 text-current" />
            <span>{isCompared ? 'Compared' : '+ Compare'}</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Header Row: Trade & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-[#0F9D91] tracking-wide uppercase">
              {professional.categoryName}
            </span>
            <RatingDisplay rating={professional.rating} reviewCount={professional.reviewCount} size="sm" />
          </div>

          {/* Name & Title */}
          <Link href={`/professionals/${professional.slug}`} className="block group-hover:text-[#173B67] transition-colors">
            <h3 className="text-base font-bold text-[#263445] leading-snug">
              {professional.name}
            </h3>
          </Link>
          <p className="text-xs text-[#667085] mt-0.5 line-clamp-1">
            {professional.tradeTitle}
          </p>

          {/* Service Area */}
          <div className="flex items-center gap-1 text-xs text-[#667085] mt-3">
            <MapPin className="w-3.5 h-3.5 text-[#0F9D91] flex-shrink-0" />
            <span className="truncate">{professional.serviceAreas.slice(0, 3).join(', ')}</span>
          </div>

          {/* Top Skills Chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {professional.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-[11px] px-2 py-0.5 rounded-md bg-[#F7F8FA] text-[#667085] border border-[#E4E7EC]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer: Pricing & Action Button */}
        <div className="mt-5 pt-4 border-t border-[#E4E7EC] flex flex-wrap items-center justify-between gap-2">
          <PriceLabel
            diagnosticFee={professional.diagnosticFee}
            hourlyRate={professional.hourlyRate}
            compact
          />

          <Link href={`/professionals/${professional.slug}`}>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#173B67] hover:text-[#0F9D91] group-hover:translate-x-0.5 transition-all">
              <span>View Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
