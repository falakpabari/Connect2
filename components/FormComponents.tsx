import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
}

export function FormInput({ label, helperText, className = "", ...props }: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <input
        className={`w-full px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-500 ${className}`}
        {...props}
      />
      {helperText && (
        <p className="text-sm text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
}

export function FormTextarea({ label, helperText, className = "", ...props }: FormTextareaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <textarea
        className={`w-full px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-500 ${className}`}
        {...props}
      />
      {helperText && (
        <p className="text-sm text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  helperText?: string;
}

export function FormSelect({ label, helperText, className = "", children, ...props }: FormSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <select
        className={`w-full px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-500 ${className}`}
        {...props}
      >
        {children}
      </select>
      {helperText && (
        <p className="text-sm text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}
