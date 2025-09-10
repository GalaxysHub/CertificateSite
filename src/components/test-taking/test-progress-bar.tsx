'use client';

import { Card } from '@/components/ui/card';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface TestProgressBarProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answeredQuestions: Set<number>;
  flaggedQuestions: Set<number>;
  className?: string;
}

export function TestProgressBar({
  totalQuestions,
  currentQuestionIndex,
  answeredQuestions,
  flaggedQuestions,
  className = ''
}: TestProgressBarProps) {
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const answeredPercentage = (answeredQuestions.size / totalQuestions) * 100;

  const getQuestionStatus = (index: number) => {
    if (answeredQuestions.has(index)) {
      return flaggedQuestions.has(index) ? 'answered-flagged' : 'answered';
    }
    return flaggedQuestions.has(index) ? 'flagged' : 'unanswered';
  };

  return (
    <Card className={`p-4 bg-white shadow-sm ${className}`}>
      <div className="space-y-4">
        {/* Progress Info */}
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-gray-900">
            Test Progress
          </div>
          <div className="text-sm text-gray-600">
            {answeredQuestions.size} of {totalQuestions} answered
          </div>
        </div>

        {/* Main Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Question {currentQuestionIndex + 1}</span>
            <span>{Math.round(progressPercentage)}% complete</span>
          </div>
          
          <div className="relative w-full bg-gray-200 rounded-full h-3">
            {/* Answered questions background */}
            <div
              className="absolute top-0 left-0 h-3 bg-green-200 rounded-full transition-all duration-300"
              style={{ width: `${answeredPercentage}%` }}
            />
            
            {/* Current progress */}
            <div
              className="absolute top-0 left-0 h-3 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Detailed Question Indicators */}
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const status = getQuestionStatus(index);
            const isCurrent = index === currentQuestionIndex;
            
            return (
              <div
                key={index}
                className={`relative flex items-center justify-center w-6 h-6 text-xs rounded-full transition-all ${
                  isCurrent
                    ? 'ring-2 ring-blue-500 ring-offset-1 bg-blue-600 text-white font-bold'
                    : status === 'answered'
                    ? 'bg-green-100 text-green-800'
                    : status === 'answered-flagged'
                    ? 'bg-orange-100 text-orange-800'
                    : status === 'flagged'
                    ? 'bg-orange-50 text-orange-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
                title={`Question ${index + 1}${
                  status === 'answered' ? ' (Answered)' :
                  status === 'answered-flagged' ? ' (Answered, Flagged)' :
                  status === 'flagged' ? ' (Flagged)' :
                  ' (Not answered)'
                }`}
              >
                {isCurrent ? (
                  <span className="font-bold">{index + 1}</span>
                ) : status === 'answered' || status === 'answered-flagged' ? (
                  <CheckCircle className="w-3 h-3" />
                ) : status === 'flagged' ? (
                  <AlertCircle className="w-3 h-3" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
              </div>
            );
          })}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {answeredQuestions.size}
            </div>
            <div className="text-xs text-gray-500">Answered</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-orange-600">
              {flaggedQuestions.size}
            </div>
            <div className="text-xs text-gray-500">Flagged</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-600">
              {totalQuestions - answeredQuestions.size}
            </div>
            <div className="text-xs text-gray-500">Remaining</div>
          </div>
        </div>
      </div>
    </Card>
  );
}