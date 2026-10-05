'use client';

import React from 'react';
import { useToast } from '@/context/toast-context';

export interface AvailabilitySwitchProps {
  isAvailable: boolean;
  onToggle: (newState: boolean) => void;
  className?: string;
}

export function AvailabilitySwitch({
  isAvailable,
  onToggle,
  className = '',
}: AvailabilitySwitchProps) {
  const { showToast } = useToast();

  const handleToggle = () => {
    const next = !isAvailable;
    onToggle(next);
    showToast({
      type: next ? 'success' : 'info',
      title: next ? 'Now Available Today' : 'Shift Set to Off Duty',
      message: next
        ? 'Your profile is now featured as available for instant bookings today. (Demo UI state)'
        : 'You will not appear in today’s urgent dispatch queue. (Demo UI state)',
    });
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={isAvailable}
        aria-label="Toggle availability for today"
        onClick={handleToggle}
        className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#237a63] focus-visible:ring-offset-2 ${
          isAvailable ? 'bg-[#237a63]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            isAvailable ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
            }`}
          />
          <span className="text-sm font-bold text-[#172522]">
            {isAvailable ? 'Available Today' : 'Off Duty'}
          </span>
        </div>
        <span className="text-[11px] text-[#66716d]">
          {isAvailable ? 'Accepting instant dispatch' : 'Schedule paused'}
        </span>
      </div>
    </div>
  );
}
