import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-xl outline-none transition-all duration-200
            ${error
              ? 'border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900'
            }
            text-gray-900 dark:text-white placeholder-gray-400
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500 font-medium animate-pulse">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
