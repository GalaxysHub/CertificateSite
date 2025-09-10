'use client';

import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback && this.state.error) {
        return this.props.fallback(this.state.error, this.retry);
      }

      return (
        <DefaultErrorFallback 
          error={this.state.error} 
          retry={this.retry}
          errorInfo={this.state.errorInfo}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  retry: () => void;
  errorInfo?: React.ErrorInfo;
}

function DefaultErrorFallback({ error, retry, errorInfo }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <motion.div
          className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </motion.div>

        <motion.h1
          className="text-2xl font-bold text-gray-900 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Oops! Something went wrong
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          We encountered an unexpected error. Don't worry, our team has been notified.
        </motion.p>

        {isDevelopment && error && (
          <motion.details
            className="mb-6 text-left bg-gray-50 p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
              Error Details (Development)
            </summary>
            <pre className="text-xs text-red-600 overflow-auto max-h-32">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
              {errorInfo?.componentStack && `\n\nComponent Stack:${errorInfo.componentStack}`}
            </pre>
          </motion.details>
        )}

        <motion.div
          className="flex flex-col space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button onClick={retry} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Component-level error boundary for specific sections
interface SectionErrorBoundaryProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function SectionErrorBoundary({ 
  children, 
  title = "Section Error",
  description = "This section encountered an error."
}: SectionErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={(error, retry) => (
        <motion.div
          className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
          <p className="text-red-700 mb-4">{description}</p>
          <Button variant="outline" onClick={retry} size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </motion.div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

// Hook for handling async errors in components
export function useErrorHandler() {
  return (error: Error) => {
    // Trigger error boundary by throwing the error
    throw error;
  };
}

// Network error component
interface NetworkErrorProps {
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export function NetworkError({ 
  onRetry, 
  title = "Connection Error",
  description = "Unable to connect to the server. Please check your internet connection."
}: NetworkErrorProps) {
  return (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8 text-orange-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
}

// Not found error component
interface NotFoundErrorProps {
  title?: string;
  description?: string;
  showHomeButton?: boolean;
}

export function NotFoundError({ 
  title = "Page Not Found",
  description = "The page you're looking for doesn't exist or has been moved.",
  showHomeButton = true
}: NotFoundErrorProps) {
  return (
    <motion.div
      className="text-center py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600 mb-8 max-w-sm mx-auto">{description}</p>
      {showHomeButton && (
        <Button asChild>
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
        </Button>
      )}
    </motion.div>
  );
}