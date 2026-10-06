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
  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
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
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters and Sorting">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Slide-up sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-[#e3e8e3]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#237a63]" />
                <h3 className="font-bold text-lg text-[#172522]">Filters & Sorting</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="p-2 -mr-2 rounded-full text-[#66716d] hover:bg-[#f8f8f4]"
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
            <div className="p-4 px-6 border-t border-[#e3e8e3] bg-[#f8f8f4] flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={onReset}
                className="flex-1 justify-center"
              >
                Reset All
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={onClose}
                className="flex-1 justify-center"
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
