'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  RefreshCw,
  CheckCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NetworkErrorHandlerProps {
  onRetry?: () => Promise<void>;
  onDismiss?: () => void;
  className?: string;
}

export function NetworkErrorHandler({
  onRetry,
  onDismiss,
  className = ''
}: NetworkErrorHandlerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineWarning, setShowOfflineWarning] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastRetryTime, setLastRetryTime] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineWarning(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineWarning(true);
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    // Listen for network changes
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    if (!onRetry) return;
    
    try {
      setIsRetrying(true);
      await onRetry();
      setLastRetryTime(new Date());
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setLastRetryTime(null);
      }, 3000);
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleDismiss = () => {
    setShowOfflineWarning(false);
    onDismiss?.();
  };

  return (
    <div className={className}>
      {/* Network Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <AnimatePresence>
          {/* Offline Warning */}
          {showOfflineWarning && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="mb-2"
            >
              <Card className="p-4 bg-red-50 border-red-200 shadow-lg max-w-sm">
                <div className="flex items-start space-x-3">
                  <WifiOff className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-red-800 mb-1">
                      Connection Lost
                    </h4>
                    <p className="text-xs text-red-700 mb-3">
                      Your internet connection is offline. Your progress is saved locally 
                      and will sync when connection is restored.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRetry}
                        disabled={isRetrying}
                        className="text-xs h-6 px-2 border-red-300 text-red-800 hover:bg-red-100"
                      >
                        {isRetrying ? (
                          <>
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                            Retrying...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Retry
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleDismiss}
                        className="text-xs h-6 px-2 text-red-800 hover:bg-red-100"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Connection Restored */}
          {lastRetryTime && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="mb-2"
            >
              <Card className="p-4 bg-green-50 border-green-200 shadow-lg max-w-sm">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-green-800 mb-1">
                      Connection Restored
                    </h4>
                    <p className="text-xs text-green-700">
                      Your internet connection is back. Data has been synced successfully.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Network Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center"
          >
            <Badge
              variant={isOnline ? "default" : "destructive"}
              className={`flex items-center space-x-1 ${
                isOnline 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" />
                  <span>Offline</span>
                </>
              )}
            </Badge>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Full Page Error Overlay (for critical errors) */}
      <AnimatePresence>
        {!isOnline && showOfflineWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook for network status monitoring
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'offline'>('good');

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    // Monitor connection changes
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Monitor connection quality (if supported)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateConnectionQuality = () => {
        if (!navigator.onLine) {
          setConnectionQuality('offline');
        } else if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
          setConnectionQuality('poor');
        } else {
          setConnectionQuality('good');
        }
      };

      connection.addEventListener('change', updateConnectionQuality);
      updateConnectionQuality();
    }

    // Set initial status
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return {
    isOnline,
    connectionQuality,
    isGoodConnection: isOnline && connectionQuality === 'good'
  };
}