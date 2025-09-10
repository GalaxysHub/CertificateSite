"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface UseRealTimeUpdatesOptions {
  endpoint: string;
  interval?: number;
  enabled?: boolean;
}

export function useRealTimeUpdates<T>({
  endpoint,
  interval = 30000, // 30 seconds
  enabled = true
}: UseRealTimeUpdatesOptions) {
  const { data: session } = useSession();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const fetchData = async () => {
    if (!session || !enabled || !mountedRef.current) {return;}

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (mountedRef.current) {
        setData(result);
        setError(null);
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const startPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(fetchData, interval);
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const refresh = () => {
    setLoading(true);
    fetchData();
  };

  useEffect(() => {
    mountedRef.current = true;
    
    if (enabled && session) {
      fetchData();
      startPolling();
    }

    return () => {
      mountedRef.current = false;
      stopPolling();
    };
  }, [endpoint, interval, enabled, session]);

  // Handle visibility change to pause/resume updates
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else if (enabled && session && mountedRef.current) {
        fetchData();
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, session]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    startPolling,
    stopPolling
  };
}

// Hook specifically for dashboard stats with real-time updates
export function useDashboardStats() {
  return useRealTimeUpdates<any>({
    endpoint: '/api/dashboard/stats',
    interval: 60000, // 1 minute
    enabled: true
  });
}

// Hook for real-time notifications
export function useNotifications() {
  return useRealTimeUpdates<any>({
    endpoint: '/api/user/notifications',
    interval: 15000, // 15 seconds
    enabled: true
  });
}

// Hook for live test attempts (if user is taking a test)
export function useTestSession(sessionId?: string) {
  return useRealTimeUpdates<any>({
    endpoint: sessionId ? `/api/tests/sessions/${sessionId}` : '',
    interval: 5000, // 5 seconds
    enabled: !!sessionId
  });
}