'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertTriangle, CheckCircle, Clock, Flag } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  type: 'submit' | 'leave' | 'timeout';
  title: string;
  description: string;
  testProgress?: {
    totalQuestions: number;
    answeredQuestions: number;
    flaggedQuestions: number;
    remainingTime?: number;
  };
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  title,
  description,
  testProgress
}: ConfirmationModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error during confirmation:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'submit':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'timeout':
        return <Clock className="w-6 h-6 text-red-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-orange-600" />;
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case 'submit':
        return 'bg-green-600 hover:bg-green-700';
      case 'timeout':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-orange-600 hover:bg-orange-700';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            {getIcon()}
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>

        {testProgress && (
          <div className="py-4 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Test Progress Summary</h4>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {testProgress.answeredQuestions}
                  </div>
                  <div className="text-sm text-gray-500">Answered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {testProgress.flaggedQuestions}
                  </div>
                  <div className="text-sm text-gray-500">Flagged</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">
                    {testProgress.totalQuestions - testProgress.answeredQuestions}
                  </div>
                  <div className="text-sm text-gray-500">Remaining</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Completion</span>
                  <span>
                    {Math.round((testProgress.answeredQuestions / testProgress.totalQuestions) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(testProgress.answeredQuestions / testProgress.totalQuestions) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {testProgress.remainingTime !== undefined && (
                <div className="mt-3 text-center">
                  <Badge variant="outline" className="text-sm">
                    <Clock className="w-3 h-3 mr-1" />
                    {Math.floor(testProgress.remainingTime / 60)}:
                    {(testProgress.remainingTime % 60).toString().padStart(2, '0')} remaining
                  </Badge>
                </div>
              )}
            </div>

            {type === 'submit' && testProgress.flaggedQuestions > 0 && (
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                <div className="flex items-center">
                  <Flag className="w-5 h-5 text-orange-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">
                      You have {testProgress.flaggedQuestions} flagged questions
                    </p>
                    <p className="text-sm text-orange-700">
                      Consider reviewing them before submitting
                    </p>
                  </div>
                </div>
              </div>
            )}

            {type === 'submit' && testProgress.answeredQuestions < testProgress.totalQuestions && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      {testProgress.totalQuestions - testProgress.answeredQuestions} questions unanswered
                    </p>
                    <p className="text-sm text-yellow-700">
                      Unanswered questions will be marked as incorrect
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          {type !== 'timeout' && (
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isConfirming}
            >
              Cancel
            </Button>
          )}
          
          <Button
            className={getConfirmButtonColor()}
            onClick={handleConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {type === 'submit' ? 'Submitting...' : 'Processing...'}
              </>
            ) : (
              <>
                {type === 'submit' && 'Submit Test'}
                {type === 'leave' && 'Leave Test'}
                {type === 'timeout' && 'Auto-Submit'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}