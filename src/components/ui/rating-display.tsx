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
  const textSize = size === 'sm' ? 'text-xs font-semibold' : size === 'lg' ? 'text-base font-bold' : 'text-sm font-bold';

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <Star className={`${iconSize} fill-[#E7A83E] text-[#E7A83E] flex-shrink-0`} aria-hidden="true" />
      <span className={`${textSize} text-[#263445]`}>
        {formatRating(rating)}
      </span>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-[#667085]">
          ({formatReviewCount(reviewCount)})
        </span>
      )}
    </div>
  );
}
