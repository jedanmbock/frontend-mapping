import React from 'react';
import Loader from './Loader';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

const Button = ({ children, variant = 'primary', isLoading, className, ...props }: ButtonProps) => {
  const baseStyle = "w-full py-2.5 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30",
    secondary: "bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className} cursor-pointer`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Loader size="sm" /> : children}
    </button>
  );
};

export default Button;
