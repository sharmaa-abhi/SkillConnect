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
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173B67] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none';

    // Sizes
    const sizeClasses = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-4 py-2.5 gap-2 h-10',
      lg: 'text-base px-6 py-3 gap-2.5 h-12',
    }[size];

    // Variants according to SkillConnect Design System
    // Primary #173B67, Secondary #0F9D91
    const variantClasses = {
      primary: 'bg-[#173B67] hover:bg-[#0F2A4A] text-white shadow-xs hover:shadow-sm',
      secondary: 'bg-[#0F9D91] hover:bg-[#0B7F75] text-white shadow-xs hover:shadow-sm',
      accent: 'bg-[#E6F7F5] hover:bg-[#D3EFEA] text-[#0F9D91] font-semibold',
      outline: 'bg-transparent border border-[#E4E7EC] text-[#263445] hover:bg-[#F7F8FA] hover:border-[#D0D5DD]',
      ghost: 'bg-transparent text-[#667085] hover:text-[#263445] hover:bg-black/[0.04]',
      danger: 'bg-[#B42318] hover:bg-[#911C13] text-white shadow-xs',
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
