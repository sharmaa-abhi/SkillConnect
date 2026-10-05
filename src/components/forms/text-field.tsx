'use client';

import React, { forwardRef, useState, InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
  isPassword?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      isPassword = false,
      type = 'text',
      className = '',
      required,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label
          htmlFor={id}
          className="text-xs font-semibold text-[#172522] flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-[#b42318] ml-0.5">*</span>}
          </span>
        </label>

        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={inputType}
            required={required}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            aria-invalid={Boolean(error)}
            className={`w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border transition-all placeholder:text-[#66716d]/70 focus:outline-none ${
              error
                ? 'border-[#b42318] focus:ring-2 focus:ring-[#b42318]'
                : 'border-[#c8d3cc] focus:border-[#237a63] focus:ring-2 focus:ring-[#237a63]/20'
            } ${isPassword ? 'pr-10' : ''} ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66716d] hover:text-[#172522] focus:outline-none p-1 rounded-md"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>

        {error && (
          <p id={`${id}-error`} role="alert" aria-live="polite" className="text-xs text-[#b42318] font-medium">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${id}-helper`} className="text-xs text-[#66716d]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
