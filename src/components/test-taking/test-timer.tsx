'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TestTimerProps {
  startTime: Date;
  timeLimit: number; // in minutes
  onTimeExpired?: () => void;
  className?: string;
}

export function TestTimer({ 
  startTime, 
  timeLimit, 
  onTimeExpired,
  className = '' 
}: TestTimerProps) {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const elapsedMinutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
      const remaining = Math.max(0, timeLimit - elapsedMinutes);
      
      setRemainingTime(remaining);
      
      if (remaining === 0 && !isExpired) {
        setIsExpired(true);
        onTimeExpired?.();
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime, timeLimit, onTimeExpired, isExpired]);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:00`;
    }
    return `${mins}:00`;
  };

  const getTimerVariant = () => {
    if (isExpired) return 'destructive';
    if (remainingTime <= 5) return 'destructive';
    if (remainingTime <= 15) return 'secondary';
    return 'default';
  };

  const getTimerColor = () => {
    if (isExpired) return 'text-red-600';
    if (remainingTime <= 5) return 'text-red-600';
    if (remainingTime <= 15) return 'text-orange-600';
    return 'text-gray-900';
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className={`w-5 h-5 ${getTimerColor()}`} />
          <span className="text-sm font-medium text-gray-600">
            Time Remaining
          </span>
        </div>
        
        {remainingTime <= 15 && !isExpired && (
          <AlertTriangle className="w-5 h-5 text-orange-500 animate-pulse" />
        )}
      </div>

      <div className="mt-2">
        <div className={`text-2xl font-bold ${getTimerColor()}`}>
          {formatTime(remainingTime)}
        </div>
        
        {isExpired && (
          <Badge variant="destructive" className="mt-2">
            Time Expired
          </Badge>
        )}
        
        {remainingTime <= 15 && remainingTime > 0 && (
          <Badge variant="secondary" className="mt-2 bg-orange-100 text-orange-800">
            {remainingTime <= 5 ? 'Critical Time!' : 'Low Time!'}
          </Badge>
        )}
      </div>

      {/* Visual progress bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              isExpired
                ? 'bg-red-500'
                : remainingTime <= 5
                ? 'bg-red-500'
                : remainingTime <= 15
                ? 'bg-orange-500'
                : 'bg-green-500'
            }`}
            style={{
              width: `${Math.max(0, (remainingTime / timeLimit) * 100)}%`,
            }}
          />
        </div>
      </div>
    </Card>
  );
}