'use client';

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    // Base styles: accessible focus ring, active scale, transition
    const baseClasses =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none cursor-pointer';

    // Sizes
    const sizeClasses = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-4 py-2.5 gap-2 h-10',
      lg: 'text-base px-6 py-3 gap-2.5 h-12',
    }[size];

    // Variants according to SkillConnect Black, White, Green, and Blue Design System
    // Green (#16A34A) for primary actions, Black (#0B0F0E) for secondary/dark surfaces, Blue (#2563EB) for info/focus
    const variantClasses = {
      primary: 'bg-[#16A34A] hover:bg-[#15803D] text-white shadow-xs hover:shadow-sm',
      secondary: 'bg-[#0B0F0E] hover:bg-[#1F2937] text-white shadow-xs hover:shadow-sm',
      accent: 'bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] font-semibold border border-[#2563EB]/20',
      outline: 'bg-white border border-[#E5E7EB] text-[#111827] hover:bg-[#F8FAFC] hover:border-[#D1D5DB]',
      ghost: 'bg-transparent text-[#4B5563] hover:text-[#111827] hover:bg-black/[0.04]',
      danger: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-xs',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
