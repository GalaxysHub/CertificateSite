'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  Circle, 
  Flag, 
  AlertTriangle,
  Send,
  Edit
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

import { TestQuestion } from '@/lib/test-utils';

interface ReviewModeProps {
  isOpen: boolean;
  onClose: () => void;
  questions: TestQuestion[];
  answers: Record<string, string>;
  flaggedQuestions: Set<number>;
  currentQuestionIndex: number;
  onGoToQuestion: (index: number) => void;
  onSubmitTest: () => void;
  className?: string;
}

export function ReviewMode({
  isOpen,
  onClose,
  questions,
  answers,
  flaggedQuestions,
  currentQuestionIndex,
  onGoToQuestion,
  onSubmitTest,
  className = ''
}: ReviewModeProps) {
  const [filterType, setFilterType] = useState<'all' | 'answered' | 'unanswered' | 'flagged'>('all');

  const getQuestionStatus = (index: number, questionId: string) => {
    const hasAnswer = answers[questionId] && answers[questionId].trim() !== '';
    const isFlagged = flaggedQuestions.has(index);
    
    if (hasAnswer && isFlagged) return 'answered-flagged';
    if (hasAnswer) return 'answered';
    if (isFlagged) return 'flagged';
    return 'unanswered';
  };

  const getFilteredQuestions = () => {
    return questions.map((question, index) => ({
      ...question,
      index,
      status: getQuestionStatus(index, question.id)
    })).filter(item => {
      switch (filterType) {
        case 'answered':
          return item.status === 'answered' || item.status === 'answered-flagged';
        case 'unanswered':
          return item.status === 'unanswered' || item.status === 'flagged';
        case 'flagged':
          return item.status === 'flagged' || item.status === 'answered-flagged';
        default:
          return true;
      }
    });
  };

  const getStatusStats = () => {
    const stats = {
      answered: 0,
      unanswered: 0,
      flagged: 0,
      total: questions.length
    };

    questions.forEach((question, index) => {
      const status = getQuestionStatus(index, question.id);
      
      if (status === 'answered' || status === 'answered-flagged') {
        stats.answered++;
      } else {
        stats.unanswered++;
      }
      
      if (status === 'flagged' || status === 'answered-flagged') {
        stats.flagged++;
      }
    });

    return stats;
  };

  const handleGoToQuestion = (index: number) => {
    onGoToQuestion(index);
    onClose();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'answered-flagged':
        return <CheckCircle className="w-4 h-4 text-orange-600" />;
      case 'flagged':
        return <Flag className="w-4 h-4 text-orange-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered':
        return 'border-green-200 bg-green-50';
      case 'answered-flagged':
        return 'border-orange-200 bg-orange-50';
      case 'flagged':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const filteredQuestions = getFilteredQuestions();
  const stats = getStatusStats();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col ${className}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Review Test</h2>
              <p className="text-sm text-gray-600 mt-1">
                Review your answers before submitting
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Stats Summary */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.answered}</div>
                <div className="text-sm text-gray-500">Answered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.unanswered}</div>
                <div className="text-sm text-gray-500">Unanswered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.flagged}</div>
                <div className="text-sm text-gray-500">Flagged</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Completion</span>
                <span>{Math.round((stats.answered / stats.total) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.answered / stats.total) * 100}%` }}
                />
              </div>
            </div>

            {stats.unanswered > 0 && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-sm text-yellow-800">
                    {stats.unanswered} questions remain unanswered. They will be marked as incorrect if submitted.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Filter Controls */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                All Questions ({stats.total})
              </Button>
              <Button
                variant={filterType === 'answered' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('answered')}
                className={filterType === 'answered' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Answered ({stats.answered})
              </Button>
              <Button
                variant={filterType === 'unanswered' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('unanswered')}
                className={filterType === 'unanswered' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Unanswered ({stats.unanswered})
              </Button>
              <Button
                variant={filterType === 'flagged' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('flagged')}
                className={filterType === 'flagged' ? 'bg-orange-600 hover:bg-orange-700' : ''}
              >
                Flagged ({stats.flagged})
              </Button>
            </div>
          </div>

          {/* Questions List */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-4">
                {filteredQuestions.map((item) => (
                  <Card
                    key={item.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      item.index === currentQuestionIndex
                        ? 'ring-2 ring-blue-500 border-blue-500'
                        : getStatusColor(item.status)
                    }`}
                    onClick={() => handleGoToQuestion(item.index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge variant="outline" className="text-xs">
                              Question {item.index + 1}
                            </Badge>
                            {getStatusIcon(item.status)}
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                item.status === 'answered' 
                                  ? 'bg-green-100 text-green-800'
                                  : item.status === 'flagged' || item.status === 'answered-flagged'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {item.status === 'answered' ? 'Answered' :
                               item.status === 'answered-flagged' ? 'Answered & Flagged' :
                               item.status === 'flagged' ? 'Flagged' :
                               'Not Answered'}
                            </Badge>
                          </div>

                          <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                            {item.question}
                          </h4>

                          {answers[item.id] && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                              <div className="text-sm text-blue-800">
                                <strong>Your answer:</strong> {answers[item.id]}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex flex-col items-center space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGoToQuestion(item.index);
                            }}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredQuestions.length === 0 && (
                  <div className="text-center py-8">
                    <Circle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No questions match this filter
                    </h3>
                    <p className="text-gray-600">
                      Try selecting a different filter to see more questions.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Continue Test
              </Button>

              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
                  Ready to submit?
                </div>
                <Button
                  onClick={onSubmitTest}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Test
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}