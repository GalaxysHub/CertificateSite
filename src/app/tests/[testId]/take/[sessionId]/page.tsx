'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Send,
  AlertTriangle,
  CheckCircle,
  Eye,
  ArrowLeft
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TestErrorBoundary } from '@/components/test-taking/test-error-boundary';
import { NetworkErrorHandler, useNetworkStatus } from '@/components/test-taking/network-error-handler';
import { KeyboardShortcutsHelp } from '@/components/test-taking/keyboard-shortcuts-help';
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation';

import { TestTimer } from '@/components/test-taking/test-timer';
import { QuestionNavigation } from '@/components/test-taking/question-navigation';
import { QuestionDisplay } from '@/components/test-taking/question-display';
import { TestProgressBar } from '@/components/test-taking/test-progress-bar';
import { ConfirmationModal } from '@/components/test-taking/confirmation-modal';
import { ReviewMode } from '@/components/test-taking/review-mode';

import { TestQuestion } from '@/lib/test-utils';

interface TestSession {
  testId: string;
  startTime: string;
  timeLimit: number;
  currentQuestionIndex: number;
  totalQuestions: number;
}

interface TestProgress {
  currentQuestion: number;
  totalQuestions: number;
  percentage: number;
  answeredQuestions: number;
  remainingTime: number;
}

interface TestTakePageProps {
  params: {
    testId: string;
    sessionId: string;
  };
}

export default function TestTakePage({ params }: TestTakePageProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Network status monitoring
  const { isOnline, connectionQuality } = useNetworkStatus();
  
  // Test session state
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<TestQuestion | null>(null);
  const [testProgress, setTestProgress] = useState<TestProgress | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // UI state
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showReview, setShowReview] = useState(false);
  const [allQuestions, setAllQuestions] = useState<TestQuestion[]>([]);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'submit' | 'leave' | 'timeout';
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: 'submit',
    title: '',
    description: ''
  });

  // React Hook Form
  const { watch, setValue, getValues } = useForm({
    defaultValues: {
      answers: {} as Record<string, string>
    }
  });

  // Keyboard navigation
  const { shortcuts } = useKeyboardNavigation({
    onNext: () => testSession && navigateToQuestion('next'),
    onPrevious: () => testSession && navigateToQuestion('previous'),
    onSubmit: () => setConfirmationModal({
      isOpen: true,
      type: 'submit',
      title: 'Submit Test',
      description: 'Are you sure you want to submit your test? This action cannot be undone.'
    }),
    onReview: () => setShowReview(true),
    onFlag: handleToggleFlag,
    canNavigateNext: testSession ? testSession.currentQuestionIndex < testProgress?.totalQuestions - 1 : false,
    canNavigatePrevious: testSession ? testSession.currentQuestionIndex > 0 : false,
    enabled: !showReview && !confirmationModal.isOpen
  });

  // Load test session
  const loadTestSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tests/sessions/${params.sessionId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load test session');
      }
      
      const data = await response.json();
      
      setTestSession({
        ...data.testSession,
        startTime: data.testSession.startTime
      });
      setCurrentQuestion(data.currentQuestion);
      setTestProgress(data.progress);
      setAnswers(data.answers || {});
      
      // Store all questions for review mode
      if (data.testSession && data.testSession.questions) {
        setAllQuestions(data.testSession.questions);
      }
      
      // Initialize form with existing answers
      setValue('answers', data.answers || {});
      
    } catch (error) {
      console.error('Error loading test session:', error);
      setError(error instanceof Error ? error.message : 'Failed to load test session');
    } finally {
      setIsLoading(false);
    }
  }, [params.sessionId, setValue]);

  // Save answer
  const saveAnswer = useCallback(async (questionId: string, answer: string) => {
    try {
      setIsSaving(true);
      
      const response = await fetch(`/api/tests/sessions/${params.sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          answer
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'Test session has expired') {
          handleTimeExpired();
          return;
        }
        throw new Error(errorData.error || 'Failed to save answer');
      }

      const data = await response.json();
      setAnswers(data.answers);
      setTestProgress(data.progress);
      
    } catch (error) {
      console.error('Error saving answer:', error);
    } finally {
      setIsSaving(false);
    }
  }, [params.sessionId]);

  // Navigate to question
  const navigateToQuestion = useCallback(async (action: 'next' | 'previous' | 'goto', questionIndex?: number) => {
    try {
      const response = await fetch(`/api/tests/sessions/${params.sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          questionIndex
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'Test session has expired') {
          handleTimeExpired();
          return;
        }
        throw new Error(errorData.error || 'Failed to navigate');
      }

      const data = await response.json();
      setTestSession(data.testSession);
      setCurrentQuestion(data.currentQuestion);
      setTestProgress(data.progress);
      setAnswers(data.answers);
      
    } catch (error) {
      console.error('Error navigating:', error);
    }
  }, [params.sessionId]);

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (!currentQuestion) {return;}
    
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: answer
    };
    
    setAnswers(updatedAnswers);
    setValue('answers', updatedAnswers);
    
    // Auto-save with debounce
    const timeoutId = setTimeout(() => {
      saveAnswer(currentQuestion.id, answer);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  // Handle question flagging
  const handleToggleFlag = () => {
    if (!testSession) {return;}
    
    const currentIndex = testSession.currentQuestionIndex;
    const newFlagged = new Set(flaggedQuestions);
    
    if (newFlagged.has(currentIndex)) {
      newFlagged.delete(currentIndex);
    } else {
      newFlagged.add(currentIndex);
    }
    
    setFlaggedQuestions(newFlagged);
  };

  // Handle time expiration
  const handleTimeExpired = useCallback(() => {
    setConfirmationModal({
      isOpen: true,
      type: 'timeout',
      title: 'Time Expired',
      description: 'The test time has expired and will be automatically submitted.'
    });
  }, []);

  // Submit test
  const submitTest = useCallback(async (forceSubmit = false) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/tests/sessions/${params.sessionId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ forceSubmit }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit test');
      }

      const data = await response.json();
      
      // Redirect to results page
      router.push(`/tests/${params.testId}/results/${data.result.attemptId}`);
      
    } catch (error) {
      console.error('Error submitting test:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit test');
    } finally {
      setIsSubmitting(false);
    }
  }, [params.sessionId, params.testId, router]);

  // Handle leave test
  const handleLeaveTest = () => {
    setConfirmationModal({
      isOpen: true,
      type: 'leave',
      title: 'Leave Test',
      description: 'Are you sure you want to leave this test? Your progress will be saved.'
    });
  };

  // Handle modal confirmation
  const handleModalConfirm = async () => {
    const { type } = confirmationModal;
    
    if (type === 'submit' || type === 'timeout') {
      await submitTest(type === 'timeout');
    } else if (type === 'leave') {
      router.push(`/tests/${params.testId}`);
    }
    
    setConfirmationModal({ ...confirmationModal, isOpen: false });
  };

  // Initialize session on load
  useEffect(() => {
    if (status === 'loading') {return;}
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    loadTestSession();
  }, [status, loadTestSession, router]);

  // Prevent browser back/refresh without confirmation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handlePopstate = (e: PopStateEvent) => {
      e.preventDefault();
      handleLeaveTest();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading test session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push(`/tests/${params.testId}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Test
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!testSession || !currentQuestion || !testProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Session Not Found</h2>
            <p className="text-gray-600 mb-4">The test session could not be loaded.</p>
            <Button onClick={() => router.push(`/tests/${params.testId}`)}>
              Start New Test
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const answeredQuestions = new Set(
    Object.keys(answers)
      .map(questionId => 
        testSession && currentQuestion ? 
        Math.max(0, testSession.currentQuestionIndex) : 0
      )
      .filter(index => answers[currentQuestion.id] !== undefined)
  );

  return (
    <TestErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Test taking error:', error, errorInfo);
        // Could also report to error monitoring service here
      }}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Fixed Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleLeaveTest}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Leave Test</span>
              </Button>

              <TestProgressBar
                totalQuestions={testProgress.totalQuestions}
                currentQuestionIndex={testSession.currentQuestionIndex}
                answeredQuestions={answeredQuestions}
                flaggedQuestions={flaggedQuestions}
                className="flex-1 mx-4 max-w-md"
              />

              <div className="flex items-center space-x-2">
                <KeyboardShortcutsHelp 
                  shortcuts={shortcuts}
                  className="hidden lg:flex"
                />

                <Button
                  variant="outline"
                  onClick={() => setShowReview(!showReview)}
                  className="hidden md:flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Review</span>
                </Button>

                <Button
                  onClick={() => setConfirmationModal({
                    isOpen: true,
                    type: 'submit',
                    title: 'Submit Test',
                    description: 'Are you sure you want to submit your test? This action cannot be undone.'
                  })}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!isOnline && connectionQuality === 'offline'}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <TestTimer
                startTime={new Date(testSession.startTime)}
                timeLimit={testSession.timeLimit}
                onTimeExpired={handleTimeExpired}
              />

              <QuestionNavigation
                totalQuestions={testProgress.totalQuestions}
                currentQuestionIndex={testSession.currentQuestionIndex}
                answeredQuestions={answeredQuestions}
                flaggedQuestions={flaggedQuestions}
                onQuestionSelect={(index) => navigateToQuestion('goto', index)}
                className="hidden lg:block"
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <QuestionDisplay
                    question={currentQuestion}
                    questionNumber={testSession.currentQuestionIndex + 1}
                    totalQuestions={testProgress.totalQuestions}
                    selectedAnswer={answers[currentQuestion.id]}
                    isFlagged={flaggedQuestions.has(testSession.currentQuestionIndex)}
                    onAnswerSelect={handleAnswerSelect}
                    onToggleFlag={handleToggleFlag}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="mt-6 flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => navigateToQuestion('previous')}
                  disabled={testSession.currentQuestionIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {isSaving && (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Saving...</span>
                    </>
                  )}
                  {!isSaving && answers[currentQuestion.id] && (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Saved</span>
                    </>
                  )}
                </div>

                <Button
                  onClick={() => navigateToQuestion('next')}
                  disabled={testSession.currentQuestionIndex === testProgress.totalQuestions - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Review Mode */}
        <ReviewMode
          isOpen={showReview}
          onClose={() => setShowReview(false)}
          questions={allQuestions}
          answers={answers}
          flaggedQuestions={flaggedQuestions}
          currentQuestionIndex={testSession.currentQuestionIndex}
          onGoToQuestion={(index) => navigateToQuestion('goto', index)}
          onSubmitTest={() => {
            setShowReview(false);
            setConfirmationModal({
              isOpen: true,
              type: 'submit',
              title: 'Submit Test',
              description: 'Are you sure you want to submit your test? This action cannot be undone.'
            });
          }}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
          onConfirm={handleModalConfirm}
          type={confirmationModal.type}
          title={confirmationModal.title}
          description={confirmationModal.description}
          testProgress={{
            totalQuestions: testProgress.totalQuestions,
            answeredQuestions: answeredQuestions.size,
            flaggedQuestions: flaggedQuestions.size,
            remainingTime: testProgress.remainingTime
          }}
        />

        {/* Network Error Handler */}
        <NetworkErrorHandler
          onRetry={loadTestSession}
          onDismiss={() => {}}
        />
      </div>
    </TestErrorBoundary>
  );
}