'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, SlidersHorizontal } from 'lucide-react';
import { FilterState } from '@/types';
import { FilterSidebar } from '@/components/professionals/filter-sidebar';
import { Button } from '@/components/ui/button';

export interface FilterDrawerMobileProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  resultsCount: number;
}

export function FilterDrawerMobile({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  resultsCount,
}: FilterDrawerMobileProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Filters and Sorting">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Side Left Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-full max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col overflow-hidden z-50 border-r border-[#E5E7EB]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-[#E5E7EB] bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4 text-[#16A34A]" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[#111827] leading-tight">Filters & Sorting</h3>
                  <p className="text-[11px] text-[#4B5563] leading-none mt-0.5">Refine verified service specialists</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="p-2 -mr-2 rounded-xl text-[#4B5563] hover:text-[#111827] hover:bg-[#F8FAFC] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filter Content */}
            <div className="p-4 overflow-y-auto flex-1">
              <FilterSidebar
                filters={filters}
                onChange={onChange}
                onReset={onReset}
                className="border-0 p-0 shadow-none"
              />
            </div>

            {/* Bottom Actions */}
            <div className="p-3 sm:p-4 px-4 sm:px-6 border-t border-[#E5E7EB] bg-[#F8FAFC] flex items-center gap-2.5 sm:gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={onReset}
                className="flex-1 justify-center rounded-xl font-bold min-h-[44px] text-xs sm:text-sm"
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={onClose}
                className="flex-1 justify-center rounded-xl font-bold shadow-xs min-h-[44px] text-xs sm:text-sm"
              >
                Show {resultsCount} {resultsCount === 1 ? 'Pro' : 'Pros'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
