'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    children, 
    className = '',
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
      secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500',
      success: 'bg-success-600 hover:bg-success-700 text-white focus:ring-success-500',
      warning: 'bg-warning-600 hover:bg-warning-700 text-white focus:ring-warning-500',
      outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const classes = clsx(
      baseClasses,
      variants[variant],
      sizes[size],
      className
    );

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
        {...props}
      >
        {loading && (
          <div className="spinner w-4 h-4 mr-2" />
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
