'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <Loader2 className="w-full h-full text-blue-600" />
    </motion.div>
  );
}

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message = 'Loading...' }: LoadingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <motion.p
          className="text-gray-600 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <motion.div
      className="border rounded-lg p-6 bg-white shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="animate-pulse">
        <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </motion.div>
  );
}

export function TestCardSkeleton() {
  return (
    <motion.div
      className="border rounded-lg overflow-hidden bg-white shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface SkeletonGridProps {
  count?: number;
  component?: React.ComponentType;
}

export function SkeletonGrid({ 
  count = 6, 
  component: Component = CardSkeleton 
}: SkeletonGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Component key={index} />
      ))}
    </div>
  );
}

export function LoadingButton() {
  return (
    <motion.button
      disabled
      className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <LoadingSpinner size="sm" className="mr-2" />
      Loading...
    </motion.button>
  );
}

interface InlineLoadingProps {
  text?: string;
  className?: string;
}

export function InlineLoading({ text = 'Loading', className = '' }: InlineLoadingProps) {
  return (
    <motion.div
      className={`flex items-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <LoadingSpinner size="sm" className="mr-2" />
      <span className="text-sm text-gray-600">{text}...</span>
    </motion.div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <motion.div
      className="bg-white rounded-lg border overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="animate-pulse">
        {/* Header */}
        <div className="border-b bg-gray-50 px-6 py-3">
          <div className="flex space-x-4">
            {Array.from({ length: cols }).map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded flex-1"></div>
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="border-b last:border-b-0 px-6 py-4">
            <div className="flex space-x-4">
              {Array.from({ length: cols }).map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-200 rounded flex-1"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}