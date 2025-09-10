'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRetrying: boolean;
}

export class TestErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    isRetrying: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      isRetrying: false
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Test Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);

    // Report to error monitoring service
    this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real application, you would send this to your error monitoring service
    console.log('Error reported:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  };

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.setState({ isRetrying: true });
      
      // Simulate retry delay
      setTimeout(() => {
        this.retryCount++;
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
          isRetrying: false
        });
      }, 1000);
    }
  };

  private handleGoBack = () => {
    window.history.back();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.retryCount < this.maxRetries;

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Something went wrong
                  </h2>
                  <p className="text-sm text-gray-600 font-normal">
                    The test encountered an unexpected error
                  </p>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-red-800 mb-2">
                  Error Details
                </h3>
                <p className="text-sm text-red-700 font-mono break-all">
                  {this.state.error?.message || 'Unknown error occurred'}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  What happened to my progress?
                </h3>
                <p className="text-sm text-blue-700">
                  Don't worry! Your test progress is automatically saved. 
                  You can safely retry or go back to continue where you left off.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {canRetry && (
                  <Button
                    onClick={this.handleRetry}
                    disabled={this.state.isRetrying}
                    className="flex-1"
                  >
                    {this.state.isRetrying ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry ({this.maxRetries - this.retryCount} attempts left)
                      </>
                    )}
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={this.handleGoBack}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>

                <Button
                  variant="outline"
                  onClick={this.handleReload}
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
              </div>

              {!canRetry && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Bug className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-orange-800 mb-1">
                        Maximum retries reached
                      </h3>
                      <p className="text-sm text-orange-700">
                        The error persists after multiple retry attempts. 
                        Please try reloading the page or contact support if the problem continues.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="bg-gray-50 border rounded-lg p-4">
                  <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                    Developer Info (Development Mode Only)
                  </summary>
                  <div className="mt-2 space-y-2">
                    <div>
                      <h4 className="text-xs font-medium text-gray-600 mb-1">Stack Trace:</h4>
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono overflow-auto max-h-32">
                        {this.state.error?.stack}
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-600 mb-1">Component Stack:</h4>
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono overflow-auto max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}