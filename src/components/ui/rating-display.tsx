import React from 'react';
import { Star } from 'lucide-react';
import { formatRating, formatReviewCount } from '@/lib/formatters';

export interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export function RatingDisplay({
  rating,
  reviewCount,
  size = 'md',
  showCount = true,
  className = '',
}: RatingDisplayProps) {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base font-semibold' : 'text-sm font-semibold';

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <Star className={`${iconSize} fill-[#e5a33d] text-[#e5a33d] flex-shrink-0`} aria-hidden="true" />
      <span className={`${textSize} text-[#965b00]`}>
        {formatRating(rating)}
      </span>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-[#66716d]">
          ({formatReviewCount(reviewCount)})
        </span>
      )}
    </div>
  );
}
