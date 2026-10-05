import React from 'react';
import { ProfessionalProfile } from '@/types/professional';
import { ProfessionalCard } from '@/components/professionals/professional-card';

export interface ProfessionalGridProps {
  professionals: ProfessionalProfile[];
  columns?: '2' | '3' | '4';
  className?: string;
}

export function ProfessionalGrid({
  professionals,
  columns = '3',
  className = '',
}: ProfessionalGridProps) {
  const colClasses = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  return (
    <div className={`grid gap-6 ${colClasses} ${className}`}>
      {professionals.map((pro) => (
        <ProfessionalCard key={pro.id} professional={pro} />
      ))}
    </div>
  );
}
