'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Skeleton loading component
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = 'md',
  animate = true,
}) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const baseClasses = `bg-gray-200 ${roundedClasses[rounded]} ${className}`;
  
  if (animate) {
    return (
      <motion.div
        className={baseClasses}
        style={{ width, height }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  }

  return (
    <div
      className={baseClasses}
      style={{ width, height }}
    />
  );
};

// Text skeleton for loading text
interface TextSkeletonProps {
  lines?: number;
  className?: string;
  lineHeight?: string;
  spacing?: string;
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 3,
  className = '',
  lineHeight = 'h-4',
  spacing = 'space-y-2',
}) => {
  return (
    <div className={`${spacing} ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={lineHeight}
          width={index === lines - 1 ? '60%' : '100%'}
          animate={true}
        />
      ))}
    </div>
  );
};

// Card skeleton for loading cards
interface CardSkeletonProps {
  className?: string;
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showActions?: boolean;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  className = '',
  showImage = true,
  showTitle = true,
  showDescription = true,
  showActions = true,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {showImage && (
        <Skeleton
          className="w-full h-48 rounded-t-lg"
          animate={true}
        />
      )}
      <div className="p-4 space-y-3">
        {showTitle && (
          <Skeleton
            className="h-6 w-3/4"
            animate={true}
          />
        )}
        {showDescription && (
          <TextSkeleton
            lines={2}
            className="space-y-2"
          />
        )}
        {showActions && (
          <div className="flex space-x-2 pt-2">
            <Skeleton
              className="h-8 w-20"
              animate={true}
            />
            <Skeleton
              className="h-8 w-20"
              animate={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Table skeleton for loading tables
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-3 text-left">
                  <Skeleton
                    className="h-4 w-20"
                    animate={true}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    <Skeleton
                      className="h-4 w-24"
                      animate={true}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// List skeleton for loading lists
interface ListSkeletonProps {
  items?: number;
  className?: string;
  showAvatar?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  items = 5,
  className = '',
  showAvatar = true,
  showTitle = true,
  showDescription = true,
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
          {showAvatar && (
            <Skeleton
              className="w-10 h-10"
              rounded="full"
              animate={true}
            />
          )}
          <div className="flex-1 space-y-2">
            {showTitle && (
              <Skeleton
                className="h-4 w-3/4"
                animate={true}
              />
            )}
            {showDescription && (
              <Skeleton
                className="h-3 w-1/2"
                animate={true}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Spinner component
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'secondary' | 'white';
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  color = 'primary',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg
        className="w-full h-full"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  );
};

// Loading overlay
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  className = '',
  message = 'Loading...',
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

// Page loading component
interface PageLoadingProps {
  message?: string;
  className?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  message = 'Loading page...',
  className = '',
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-center">
        <Spinner size="xl" className="mb-6" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {message}
        </h2>
        <p className="text-gray-600">
          Please wait while we load your content...
        </p>
      </div>
    </div>
  );
};

// Button loading state
interface ButtonLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  isLoading,
  children,
  loadingText = 'Loading...',
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      {isLoading && (
        <Spinner size="sm" className="mr-2" color="white" />
      )}
      {isLoading ? loadingText : children}
    </div>
  );
};
