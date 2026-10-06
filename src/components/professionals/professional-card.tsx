'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { ProfessionalProfile } from '@/types/professional';
import { RatingDisplay } from '@/components/ui/rating-display';
import { PriceLabel } from '@/components/ui/price-label';
import { VerifiedProBadge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/professionals/favorite-button';

export interface ProfessionalCardProps {
  professional: ProfessionalProfile;
  className?: string;
}

export function ProfessionalCard({ professional, className = '' }: ProfessionalCardProps) {
  const [imgError, setImgError] = useState(false);

  // Fallback initials
  const initials = professional.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  return (
    <div
      className={`group flex flex-col bg-white rounded-2xl border border-[#e3e8e3] hover:border-[#c8d3cc] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${className}`}
    >
      {/* Top Image & Badges */}
      <div className="relative w-full h-48 bg-gradient-to-br from-[#143d35] to-[#237a63] overflow-hidden">
        {!imgError ? (
          <img
            src={professional.avatarUrl}
            alt={professional.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#143d35] text-white">
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
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-200 backdrop-blur-md border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available Today
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Header Row: Trade & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold text-[#237a63] tracking-wide uppercase">
              {professional.categoryName}
            </span>
            <RatingDisplay rating={professional.rating} reviewCount={professional.reviewCount} size="sm" />
          </div>

          {/* Name & Title */}
          <Link href={`/professionals/${professional.slug}`} className="block group-hover:text-[#237a63] transition-colors">
            <h3 className="text-base font-bold text-[#172522] leading-snug">
              {professional.name}
            </h3>
          </Link>
          <p className="text-xs text-[#66716d] mt-0.5 line-clamp-1">
            {professional.tradeTitle}
          </p>

          {/* Service Area */}
          <div className="flex items-center gap-1 text-xs text-[#66716d] mt-3">
            <MapPin className="w-3.5 h-3.5 text-[#237a63] flex-shrink-0" />
            <span className="truncate">{professional.serviceAreas.slice(0, 3).join(', ')}</span>
          </div>

          {/* Top Skills Chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {professional.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-[11px] px-2 py-0.5 rounded-md bg-[#f8f8f4] text-[#66716d] border border-[#e3e8e3]/80"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer: Pricing & Action Button */}
        <div className="mt-5 pt-4 border-t border-[#e3e8e3] flex items-center justify-between">
          <PriceLabel
            diagnosticFee={professional.diagnosticFee}
            hourlyRate={professional.hourlyRate}
            compact
          />

          <Link href={`/professionals/${professional.slug}`}>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#237a63] hover:text-[#143d35] group-hover:translate-x-0.5 transition-all">
              <span>View Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
