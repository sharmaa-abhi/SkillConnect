'use client';

import React from 'react';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';
import { Professional } from '@/types/professional';
import { Button } from '@/components/ui/button';

export interface ComparisonFloatingBarProps {
  comparedPros: Professional[];
  onOpenModal: () => void;
  onRemovePro: (proId: string) => void;
  onClearAll: () => void;
}

export function ComparisonFloatingBar({
  comparedPros,
  onOpenModal,
  onRemovePro,
  onClearAll,
}: ComparisonFloatingBarProps) {
  if (comparedPros.length === 0) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-auto z-30 animate-in slide-in-from-bottom-4 duration-200">
      <div className="bg-[#173B67] text-white rounded-2xl sm:rounded-full p-2.5 sm:p-2 sm:pl-4 shadow-[0_12px_32px_rgba(23,59,103,0.28)] border border-white/20 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 max-w-xl">
        {/* Left Thumbnails & Counter */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#0F9D91] text-white flex items-center justify-center font-bold text-xs shrink-0">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0F9D91]">
                Compare
              </span>
              <span className="text-xs font-bold text-white mt-0.5">
                {comparedPros.length} of 3 Selected
              </span>
            </div>
          </div>

          {/* Selected Pro Mini Avatars */}
          <div className="flex items-center -space-x-1.5 ml-2">
            {comparedPros.map((pro) => (
              <div key={pro.id} className="relative group">
                <img
                  src={pro.avatarUrl}
                  alt={pro.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#173B67] shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => onRemovePro(pro.id)}
                  aria-label={`Remove ${pro.name}`}
                  title={`Remove ${pro.name}`}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] opacity-90 hover:opacity-100 hover:scale-110 transition-all"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenModal}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl sm:rounded-full bg-[#0F9D91] hover:bg-[#0D877D] text-white text-xs font-bold transition-all shadow-xs active:scale-95 whitespace-nowrap min-h-[38px]"
          >
            <span>Compare Side-by-Side</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClearAll}
            className="p-2 rounded-xl sm:rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors text-xs shrink-0 min-h-[38px] flex items-center justify-center"
            title="Clear comparison selection"
            aria-label="Clear all compared pros"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
