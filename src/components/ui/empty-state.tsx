import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  query?: string;
  icon?: React.ReactNode;
  onReset?: () => void;
  actionText?: string;
  className?: string;
}

export function EmptyState({
  title = 'No professionals found matching your search',
  description,
  query,
  icon,
  onReset,
  actionText = 'Reset All Filters',
  className = '',
}: EmptyStateProps) {
  const defaultDesc = query
    ? `We couldn't find any professionals matching "${query}" with your current filters. Try clearing your filters or checking a nearby neighborhood.`
    : 'Try broadening your search criteria or resetting filters to explore all available local professionals.';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-white border border-[#e3e8e3] ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-[#e7f4ed] flex items-center justify-center text-[#237a63] mb-4">
        {icon || <SearchX className="w-7 h-7" />}
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-[#172522] mb-2">{title}</h3>

      <p className="text-sm text-[#66716d] max-w-md mb-6 leading-relaxed">
        {description || defaultDesc}
      </p>

      {onReset && (
        <Button
          variant="outline"
          size="md"
          onClick={onReset}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}
