'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface QuestionNavigationProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answeredQuestions: Set<number>;
  flaggedQuestions: Set<number>;
  onQuestionSelect: (index: number) => void;
  className?: string;
}

export function QuestionNavigation({
  totalQuestions,
  currentQuestionIndex,
  answeredQuestions,
  flaggedQuestions,
  onQuestionSelect,
  className = ''
}: QuestionNavigationProps) {
  const getQuestionStatus = (index: number) => {
    if (answeredQuestions.has(index)) {
      return flaggedQuestions.has(index) ? 'answered-flagged' : 'answered';
    }
    return flaggedQuestions.has(index) ? 'flagged' : 'unanswered';
  };

  const getButtonVariant = (index: number) => {
    if (index === currentQuestionIndex) return 'default';
    
    const status = getQuestionStatus(index);
    switch (status) {
      case 'answered':
        return 'outline';
      case 'answered-flagged':
        return 'secondary';
      case 'flagged':
        return 'secondary';
      default:
        return 'ghost';
    }
  };

  const getButtonIcon = (index: number) => {
    const status = getQuestionStatus(index);
    
    if (status === 'answered' || status === 'answered-flagged') {
      return <CheckCircle className="w-3 h-3" />;
    }
    
    if (status === 'flagged') {
      return <AlertCircle className="w-3 h-3" />;
    }
    
    return <Circle className="w-3 h-3" />;
  };

  const getProgressStats = () => {
    const answered = answeredQuestions.size;
    const flagged = flaggedQuestions.size;
    const unanswered = totalQuestions - answered;
    
    return { answered, flagged, unanswered };
  };

  const stats = getProgressStats();

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Question Navigation</h3>
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-medium text-green-600">{stats.answered}</div>
            <div className="text-gray-500">Answered</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-orange-600">{stats.flagged}</div>
            <div className="text-gray-500">Flagged</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-600">{stats.unanswered}</div>
            <div className="text-gray-500">Remaining</div>
          </div>
        </div>

        {/* Question Grid */}
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }, (_, index) => (
            <Button
              key={index}
              variant={getButtonVariant(index)}
              size="sm"
              onClick={() => onQuestionSelect(index)}
              className={`h-10 w-10 p-0 relative ${
                index === currentQuestionIndex
                  ? 'ring-2 ring-blue-500 ring-offset-1'
                  : ''
              }`}
              title={`Question ${index + 1}${
                answeredQuestions.has(index) ? ' (Answered)' : ''
              }${flaggedQuestions.has(index) ? ' (Flagged)' : ''}`}
            >
              <span className="sr-only">Question {index + 1}</span>
              <span className="text-xs font-medium">{index + 1}</span>
              
              {/* Status indicator */}
              <div className="absolute -top-1 -right-1">
                {getButtonIcon(index)}
              </div>
            </Button>
          ))}
        </div>

        {/* Legend */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <span className="text-gray-600">Answered</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-3 h-3 text-orange-600" />
            <span className="text-gray-600">Flagged for review</span>
          </div>
          <div className="flex items-center space-x-2">
            <Circle className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">Not answered</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round((stats.answered / totalQuestions) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(stats.answered / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}