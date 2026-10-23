import React, { forwardRef, SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ id, label, options, error, helperText, className = '', required, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={id} className="text-xs font-bold text-[#263445]">
          {label}
          {required && <span className="text-[#B42318] ml-0.5">*</span>}
        </label>

        <select
          ref={ref}
          id={id}
          required={required}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          aria-invalid={Boolean(error)}
          className={`w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border transition-all focus:outline-none text-[#111827] ${
            error
              ? 'border-red-600 focus:ring-2 focus:ring-red-600/20'
              : 'border-[#E5E7EB] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && (
          <p id={`${id}-error`} role="alert" aria-live="polite" className="text-xs text-[#B42318] font-medium">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${id}-helper`} className="text-xs text-[#667085]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';
