import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'error' | 'success';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, variant = 'default', ...props }, ref) => {
    const baseClasses = 'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    
    const variants = {
      default: 'border-slate-300 focus:ring-sky-500 focus:border-transparent',
      error: 'border-red-500 focus:ring-red-500 focus:border-transparent',
      success: 'border-green-500 focus:ring-green-500 focus:border-transparent'
    };

    const currentVariant = error ? 'error' : variant;

    return (
      <div className="w-full">
        {label && (
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(baseClasses, variants[currentVariant], className)}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-slate-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;