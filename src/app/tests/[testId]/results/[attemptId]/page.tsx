'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target, 
  TrendingUp,
  Download,
  RotateCcw,
  Star,
  Trophy,
  Share2,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatDuration, formatTestResults, determineProficiencyLevel, SKILL_LEVELS } from '@/lib/test-utils';

interface TestResult {
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  proficiencyLevel?: string;
}

interface TestAttemptResult {
  id: string;
  result: TestResult;
  test: {
    id: string;
    title: string;
    category: string;
    passingScore: number;
  };
  certificateId?: string;
  completedAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function TestResultsPage({ 
  params 
}: { 
  params: { testId: string; attemptId: string } 
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [testResult, setTestResult] = useState<TestAttemptResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloadingCertificate, setIsDownloadingCertificate] = useState(false);

  // Load test results
  useEffect(() => {
    const loadTestResults = async () => {
      if (status === 'loading') return;
      
      if (status === 'unauthenticated') {
        router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname));
        return;
      }

      try {
        setIsLoading(true);
        
        // Mock data - in real app would fetch from API
        const mockResult: TestAttemptResult = {
          id: params.attemptId,
          result: {
            score: 42,
            totalPoints: 50,
            percentage: 84,
            passed: true,
            correctAnswers: 42,
            totalQuestions: 50,
            timeSpent: 65,
            proficiencyLevel: 'Proficient'
          },
          test: {
            id: params.testId,
            title: 'JavaScript Fundamentals Certification',
            category: 'Programming',
            passingScore: 70
          },
          certificateId: 'cert_123456',
          completedAt: new Date().toISOString(),
          user: {
            name: session?.user?.name || 'User',
            email: session?.user?.email || 'user@example.com'
          }
        };

        setTestResult(mockResult);
        
      } catch (error) {
        console.error('Error loading test results:', error);
        setError(error instanceof Error ? error.message : 'Failed to load test results');
      } finally {
        setIsLoading(false);
      }
    };

    loadTestResults();
  }, [status, params, router, session]);

  const handleDownloadCertificate = async () => {
    if (!testResult?.certificateId) return;
    
    setIsDownloadingCertificate(true);
    try {
      // In real app: download certificate PDF
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delay
      // window.open(`/api/certificates/${testResult.certificateId}/download`, '_blank');
    } catch (error) {
      console.error('Error downloading certificate:', error);
    } finally {
      setIsDownloadingCertificate(false);
    }
  };

  const handleRetakeTest = () => {
    router.push(`/tests/${params.testId}`);
  };

  const handleShareResult = async () => {
    if (!testResult) return;
    
    try {
      await navigator.share({
        title: `${testResult.test.title} - Test Results`,
        text: `I just ${testResult.result.passed ? 'passed' : 'completed'} the ${testResult.test.title} test with a score of ${testResult.result.percentage}%!`,
        url: window.location.href
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(`I just ${testResult.result.passed ? 'passed' : 'completed'} the ${testResult.test.title} test with a score of ${testResult.result.percentage}%! ${window.location.href}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !testResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error || 'Results not found'}</p>
            <Button onClick={() => router.push('/tests')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse Tests
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const { result, test, certificateId } = testResult;
  const proficiencyLevel = determineProficiencyLevel(result.percentage, 'SKILL', null);
  const formattedResults = formatTestResults(result);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              {result.passed ? (
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-green-600" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                  <Target className="w-10 h-10 text-orange-600" />
                </div>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {result.passed ? 'Congratulations!' : 'Test Completed'}
            </h1>
            
            <p className="text-xl text-gray-600 mb-4">
              {test.title}
            </p>

            <div className="flex items-center justify-center space-x-4">
              <Badge 
                variant={result.passed ? "default" : "secondary"}
                className={`text-lg px-4 py-2 ${
                  result.passed 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {result.passed ? 'PASSED' : 'NOT PASSED'}
              </Badge>
              
              {proficiencyLevel && (
                <Badge 
                  variant="outline" 
                  className="text-lg px-4 py-2 border-2"
                  style={{ borderColor: proficiencyLevel.color, color: proficiencyLevel.color }}
                >
                  {proficiencyLevel.level}
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Main Results */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {result.percentage}%
                  </div>
                  <div className="text-sm text-gray-500 mb-1">Final Score</div>
                  <div className="text-xs text-gray-400">
                    {result.score}/{result.totalPoints} points
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Correct Answers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {result.correctAnswers}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">Correct</div>
                  <div className="text-xs text-gray-400">
                    out of {result.totalQuestions}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Time Spent */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {formatDuration(result.timeSpent)}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">Time Spent</div>
                  <div className="text-xs text-gray-400">Total duration</div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-indigo-600 mb-2">
                    {formattedResults.performanceText}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">Performance</div>
                  {proficiencyLevel && (
                    <div className="text-xs text-gray-400">
                      {proficiencyLevel.description}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Detailed Results */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Score Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Score Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Correct Answers</span>
                        <span>{result.correctAnswers}/{result.totalQuestions}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(result.correctAnswers / result.totalQuestions) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Passing Score Required</span>
                        <span>{test.passingScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            result.percentage >= test.passingScore 
                              ? 'bg-green-600' 
                              : 'bg-red-600'
                          }`}
                          style={{
                            width: `${Math.min(result.percentage, 100)}%`,
                          }}
                        />
                        <div
                          className="absolute h-2 w-0.5 bg-gray-600"
                          style={{
                            left: `${test.passingScore}%`,
                            transform: 'translateX(-50%)'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {result.correctAnswers}
                        </div>
                        <div className="text-xs text-gray-500">Correct</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">
                          {result.totalQuestions - result.correctAnswers}
                        </div>
                        <div className="text-xs text-gray-500">Incorrect</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievement */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Achievement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    {result.passed ? (
                      <div>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                          Test Passed!
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          You have successfully passed the {test.title} with a score of {result.percentage}%.
                        </p>
                        {certificateId && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <Star className="w-5 h-5 text-green-600 fill-current" />
                              <span className="font-medium text-green-800">Certificate Earned</span>
                            </div>
                            <p className="text-sm text-green-700">
                              Your certificate is ready for download
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <XCircle className="w-8 h-8 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-orange-800 mb-2">
                          Test Not Passed
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          You scored {result.percentage}%, but need {test.passingScore}% to pass. Don't worry, you can retake the test!
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <Target className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-blue-800">Keep Learning</span>
                          </div>
                          <p className="text-sm text-blue-700">
                            Review the material and try again
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {certificateId && (
              <Button
                onClick={handleDownloadCertificate}
                disabled={isDownloadingCertificate}
                className="bg-green-600 hover:bg-green-700"
              >
                {isDownloadingCertificate ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </>
                )}
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleRetakeTest}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Test
            </Button>

            <Button
              variant="outline"
              onClick={handleShareResult}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Result
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push('/tests')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse More Tests
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}