'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Users, 
  Star, 
  Award, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle,
  Play,
  Shield,
  Target,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useSession } from 'next-auth/react';
import { formatDuration } from '@/lib/test-utils';

// Mock data - in a real app, this would come from an API
const mockTestData = {
  id: '1',
  title: 'JavaScript Fundamentals Certification',
  description: 'Master the fundamentals of JavaScript programming including ES6+ features, DOM manipulation, async programming, and modern development practices.',
  category: 'Programming',
  difficulty: 'intermediate',
  duration: 90, // minutes
  totalQuestions: 50,
  passingScore: 70,
  price: 0,
  rating: 4.8,
  enrolledCount: 2341,
  instructions: [
    'Read each question carefully before selecting your answer',
    'You can navigate between questions using the sidebar or navigation buttons',
    'Flag questions for review if you\'re uncertain about your answer',
    'Your progress is automatically saved as you work',
    'You must achieve 70% or higher to pass and earn your certificate',
    'Once you submit, you cannot modify your answers'
  ],
  topics: [
    'Variables and Data Types',
    'Functions and Scope',
    'Arrays and Objects',
    'ES6+ Features',
    'Asynchronous JavaScript',
    'DOM Manipulation',
    'Error Handling',
    'Modern JavaScript Patterns'
  ],
  features: [
    'Instant feedback on completion',
    'Detailed score breakdown',
    'Certificate upon passing',
    'Unlimited retakes available',
    'Mobile-friendly interface',
    'Progress auto-save'
  ]
};

export default function TestIntroPage({ params }: { params: { testId: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testData = mockTestData; // In real app: fetch from API using params.testId

  const handleStartTest = async () => {
    if (status !== 'authenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setIsStarting(true);
    setError(null);

    try {
      const response = await fetch(`/api/tests/${params.testId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start test');
      }

      const { sessionId } = await response.json();
      router.push(`/tests/${params.testId}/take/${sessionId}`);

    } catch (error) {
      console.error('Error starting test:', error);
      setError(error instanceof Error ? error.message : 'Failed to start test');
    } finally {
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
            <Badge className="mb-4" variant="outline">
              {testData.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {testData.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {testData.description}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Test Overview */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5" />
                      <span>Test Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {testData.totalQuestions}
                        </div>
                        <div className="text-sm text-gray-500">Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {formatDuration(testData.duration)}
                        </div>
                        <div className="text-sm text-gray-500">Duration</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {testData.passingScore}%
                        </div>
                        <div className="text-sm text-gray-500">To Pass</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {testData.difficulty}
                        </div>
                        <div className="text-sm text-gray-500">Difficulty</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Instructions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {testData.instructions.map((instruction, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{instruction}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Topics Covered */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>Topics Covered</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {testData.topics.map((topic, index) => (
                        <Badge key={index} variant="outline">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Test Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-medium">{testData.rating}</span>
                        <span className="text-gray-500">rating</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">
                          {testData.enrolledCount.toLocaleString()}
                        </span>
                        <span className="text-gray-500">enrolled</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Certificate</span>
                        <span className="text-gray-500">included</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="w-5 h-5" />
                      <span>Features</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {testData.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Start Test Button */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div>
                        {testData.price === 0 ? (
                          <div className="text-2xl font-bold text-green-600">Free</div>
                        ) : (
                          <div className="text-2xl font-bold text-gray-900">
                            ${testData.price}
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={handleStartTest}
                        disabled={isStarting}
                        className="w-full bg-primary hover:ring-2 hover:ring-primary hover:ring-offset-2 text-white transition-all duration-200"
                        size="lg"
                      >
                        {isStarting ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Starting Test...
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 mr-2" />
                            Start Test
                          </>
                        )}
                      </Button>

                      {error && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{error}</span>
                        </div>
                      )}

                      {status !== 'authenticated' && (
                        <div className="text-xs text-gray-500">
                          You need to sign in to take this test
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Important Notice */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">
                        Before you start:
                      </h4>
                      <div className="text-sm text-yellow-700 mt-1">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Ensure stable internet connection</li>
                          <li>Use a desktop or laptop for best experience</li>
                          <li>Close unnecessary browser tabs</li>
                          <li>Allow adequate time to complete</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}