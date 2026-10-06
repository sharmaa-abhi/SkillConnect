'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites, saveFavorites } from '@/lib/demo-storage';
import { useToast } from '@/context/toast-context';

export interface FavoriteButtonProps {
  professionalId: string;
  professionalName: string;
  className?: string;
  onToggle?: (id: string, isFavorited: boolean) => void;
}

export function FavoriteButton({
  professionalId,
  professionalName,
  className = '',
  onToggle,
}: FavoriteButtonProps) {
  const favorites = useFavorites();
  const isFavorited = favorites.includes(professionalId);
  const { showToast } = useToast();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let updated: string[];

    if (isFavorited) {
      updated = favorites.filter((id) => id !== professionalId);
      showToast({
        type: 'info',
        title: 'Removed from Favorites',
        message: `${professionalName} has been removed from your saved pros.`,
      });
      onToggle?.(professionalId, false);
    } else {
      updated = [...favorites, professionalId];
      showToast({
        type: 'success',
        title: 'Saved to Favorites',
        message: `${professionalName} added to your saved pros.`,
      });
      onToggle?.(professionalId, true);
    }

    saveFavorites(updated);
  };

  const label = isFavorited
    ? `Remove ${professionalName} from favorites`
    : `Save ${professionalName} to favorites`;

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={label}
      title={label}
      className={`p-2 rounded-full transition-all duration-150 backdrop-blur-sm ${
        isFavorited
          ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
          : 'bg-white/80 text-[#66716d] hover:text-rose-500 hover:bg-white'
      } ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-transform active:scale-125 ${
          isFavorited ? 'fill-rose-500 text-rose-500' : 'text-current'
        }`}
      />
    </button>
  );
}
