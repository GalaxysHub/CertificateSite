'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flag, Bookmark, BookmarkCheck } from 'lucide-react';
import { TestQuestion } from '@/lib/test-utils';

interface QuestionDisplayProps {
  question: TestQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | undefined;
  isFlagged: boolean;
  onAnswerSelect: (answer: string) => void;
  onToggleFlag: () => void;
  className?: string;
}

export function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  isFlagged,
  onAnswerSelect,
  onToggleFlag,
  className = ''
}: QuestionDisplayProps) {
  const renderQuestionOptions = () => {
    if (question.type === 'TRUE_FALSE') {
      return (
        <div className="space-y-3">
          {['True', 'False'].map((option) => (
            <label
              key={option}
              className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={selectedAnswer === option}
                onChange={(e) => onAnswerSelect(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="flex-1 font-medium">{option}</span>
            </label>
          ))}
        </div>
      );
    }

    if (question.type === 'MULTIPLE_CHOICE' && question.options) {
      return (
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
            return (
              <label
                key={index}
                className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => onAnswerSelect(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="w-6 h-6 rounded-full text-xs">
                      {optionLetter}
                    </Badge>
                    <span className="font-medium">{option}</span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      );
    }

    if (question.type === 'SHORT_ANSWER') {
      return (
        <div className="space-y-3">
          <textarea
            placeholder="Enter your answer here..."
            value={selectedAnswer || ''}
            onChange={(e) => onAnswerSelect(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
          <div className="text-sm text-gray-500">
            Character count: {(selectedAnswer || '').length}
          </div>
        </div>
      );
    }

    if (question.type === 'ESSAY') {
      return (
        <div className="space-y-3">
          <textarea
            placeholder="Write your essay response here..."
            value={selectedAnswer || ''}
            onChange={(e) => onAnswerSelect(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={8}
          />
          <div className="text-sm text-gray-500">
            Word count: {(selectedAnswer || '').split(/\s+/).filter(word => word.length > 0).length}
          </div>
        </div>
      );
    }

    return <div>Unsupported question type</div>;
  };

  const getQuestionTypeDisplay = () => {
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return 'Multiple Choice';
      case 'TRUE_FALSE':
        return 'True/False';
      case 'SHORT_ANSWER':
        return 'Short Answer';
      case 'ESSAY':
        return 'Essay';
      default:
        return 'Question';
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        {/* Question Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <Badge variant="outline" className="text-sm">
                Question {questionNumber} of {totalQuestions}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                {getQuestionTypeDisplay()}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {question.points} {question.points === 1 ? 'point' : 'points'}
              </Badge>
            </div>
          </div>

          {/* Flag Button */}
          <Button
            variant={isFlagged ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleFlag}
            className={isFlagged ? 'bg-orange-500 hover:bg-orange-600' : ''}
            title={isFlagged ? 'Remove flag' : 'Flag for review'}
          >
            {isFlagged ? (
              <>
                <BookmarkCheck className="w-4 h-4 mr-2" />
                Flagged
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 mr-2" />
                Flag
              </>
            )}
          </Button>
        </div>

        {/* Question Text */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 leading-relaxed mb-4">
            {question.question}
          </h2>
        </div>

        {/* Answer Options */}
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {question.type === 'MULTIPLE_CHOICE' 
                ? 'Select the best answer:' 
                : question.type === 'TRUE_FALSE'
                ? 'Select True or False:'
                : 'Provide your answer:'}
            </h3>
          </div>
          
          {renderQuestionOptions()}
        </div>

        {/* Answer Status */}
        {selectedAnswer && (
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span>Answer selected</span>
          </div>
        )}

        {/* Instructions for specific question types */}
        {(question.type === 'SHORT_ANSWER' || question.type === 'ESSAY') && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="text-sm text-blue-700">
              <strong>Instructions:</strong> {
                question.type === 'SHORT_ANSWER' 
                  ? 'Provide a concise answer. Be specific and to the point.'
                  : 'Write a comprehensive essay response. Support your arguments with relevant examples and explanations.'
              }
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}