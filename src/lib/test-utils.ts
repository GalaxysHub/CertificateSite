import { Test, Question, TestAttempt } from '@prisma/client';

// Types for test utilities
export interface TestQuestion extends Question {
  options: string[];
}

export interface TestSession {
  testId: string;
  questions: TestQuestion[];
  startTime: Date;
  timeLimit: number; // in minutes
  currentQuestionIndex: number;
  answers: Record<string, string>;
}

export interface TestResult {
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number; // in minutes
  proficiencyLevel?: string;
}

export interface ProficiencyLevel {
  level: string;
  minPercentage: number;
  maxPercentage: number;
  description: string;
  color: string;
}

// CEFR Proficiency Levels
export const CEFR_LEVELS: ProficiencyLevel[] = [
  {
    level: 'A1',
    minPercentage: 0,
    maxPercentage: 59,
    description: 'Basic User - Beginner',
    color: '#ef4444', // red-500
  },
  {
    level: 'A2',
    minPercentage: 60,
    maxPercentage: 69,
    description: 'Basic User - Elementary',
    color: '#f97316', // orange-500
  },
  {
    level: 'B1',
    minPercentage: 70,
    maxPercentage: 79,
    description: 'Independent User - Intermediate',
    color: '#eab308', // yellow-500
  },
  {
    level: 'B2',
    minPercentage: 80,
    maxPercentage: 89,
    description: 'Independent User - Upper Intermediate',
    color: '#22c55e', // green-500
  },
  {
    level: 'C1',
    minPercentage: 90,
    maxPercentage: 95,
    description: 'Proficient User - Advanced',
    color: '#3b82f6', // blue-500
  },
  {
    level: 'C2',
    minPercentage: 96,
    maxPercentage: 100,
    description: 'Proficient User - Mastery',
    color: '#8b5cf6', // violet-500
  },
];

// Professional/Technical Proficiency Levels
export const SKILL_LEVELS: ProficiencyLevel[] = [
  {
    level: 'Novice',
    minPercentage: 0,
    maxPercentage: 59,
    description: 'Limited knowledge and skills',
    color: '#ef4444', // red-500
  },
  {
    level: 'Basic',
    minPercentage: 60,
    maxPercentage: 69,
    description: 'Fundamental knowledge and skills',
    color: '#f97316', // orange-500
  },
  {
    level: 'Competent',
    minPercentage: 70,
    maxPercentage: 79,
    description: 'Good working knowledge and skills',
    color: '#eab308', // yellow-500
  },
  {
    level: 'Proficient',
    minPercentage: 80,
    maxPercentage: 89,
    description: 'Strong knowledge and advanced skills',
    color: '#22c55e', // green-500
  },
  {
    level: 'Expert',
    minPercentage: 90,
    maxPercentage: 95,
    description: 'Comprehensive knowledge and expert skills',
    color: '#3b82f6', // blue-500
  },
  {
    level: 'Master',
    minPercentage: 96,
    maxPercentage: 100,
    description: 'Exceptional knowledge and mastery-level skills',
    color: '#8b5cf6', // violet-500
  },
];

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Randomizes the order of questions for a test session
 */
export function randomizeQuestions(questions: TestQuestion[]): TestQuestion[] {
  return shuffleArray(questions);
}

/**
 * Randomizes the order of options for each question
 */
export function randomizeQuestionOptions(question: TestQuestion): TestQuestion {
  if (!question.options || question.options.length === 0) {
    return question;
  }

  const correctAnswer = question.correctAnswer;
  const shuffledOptions = shuffleArray(question.options);
  
  return {
    ...question,
    options: shuffledOptions,
  };
}

/**
 * Creates a randomized test session
 */
export function createTestSession(
  test: Test & { questions: TestQuestion[] }
): TestSession {
  // Randomize questions and their options
  const randomizedQuestions = randomizeQuestions(test.questions).map(question =>
    randomizeQuestionOptions(question)
  );

  return {
    testId: test.id,
    questions: randomizedQuestions,
    startTime: new Date(),
    timeLimit: test.duration,
    currentQuestionIndex: 0,
    answers: {},
  };
}

/**
 * Calculates test score and results
 */
export function calculateTestResults(
  testSession: TestSession,
  originalQuestions: TestQuestion[],
  completedAt: Date
): TestResult {
  const { answers, startTime, questions } = testSession;
  
  let correctAnswers = 0;
  let totalPoints = 0;
  let earnedPoints = 0;

  // Create a map of question IDs to correct answers from original questions
  const correctAnswersMap = new Map(
    originalQuestions.map(q => [q.id, q.correctAnswer])
  );

  questions.forEach(question => {
    const correctAnswer = correctAnswersMap.get(question.id);
    const userAnswer = answers[question.id];
    
    totalPoints += question.points;
    
    if (userAnswer === correctAnswer) {
      correctAnswers++;
      earnedPoints += question.points;
    }
  });

  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const timeSpent = Math.round((completedAt.getTime() - startTime.getTime()) / (1000 * 60));

  return {
    score: earnedPoints,
    totalPoints,
    percentage,
    passed: percentage >= 70, // Default passing score, should be configurable
    correctAnswers,
    totalQuestions: questions.length,
    timeSpent,
  };
}

/**
 * Determines proficiency level based on test category and score
 */
export function determineProficiencyLevel(
  percentage: number,
  testCategoryType: string,
  testLevel?: string | null
): ProficiencyLevel | null {
  // For language tests, use CEFR levels
  if (testCategoryType === 'LANGUAGE') {
    return CEFR_LEVELS.find(level => 
      percentage >= level.minPercentage && percentage <= level.maxPercentage
    ) || null;
  }
  
  // For other tests, use skill levels
  return SKILL_LEVELS.find(level => 
    percentage >= level.minPercentage && percentage <= level.maxPercentage
  ) || null;
}

/**
 * Formats test duration in a human-readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${remainingMinutes} min`;
}

/**
 * Calculates remaining time for a test session
 */
export function calculateRemainingTime(testSession: TestSession): number {
  const currentTime = new Date();
  const elapsedMinutes = Math.floor((currentTime.getTime() - testSession.startTime.getTime()) / (1000 * 60));
  return Math.max(0, testSession.timeLimit - elapsedMinutes);
}

/**
 * Checks if a test session has expired
 */
export function isTestSessionExpired(testSession: TestSession): boolean {
  return calculateRemainingTime(testSession) <= 0;
}

/**
 * Generates a test summary for certificates
 */
export function generateTestSummary(
  test: Test,
  result: TestResult,
  proficiencyLevel?: ProficiencyLevel | null
): string {
  const levelText = proficiencyLevel ? ` - ${proficiencyLevel.level} (${proficiencyLevel.description})` : '';
  
  return `Certificate of Achievement
Test: ${test.title}
Score: ${result.percentage}%${levelText}
Questions: ${result.correctAnswers}/${result.totalQuestions} correct
Date: ${new Date().toLocaleDateString()}`;
}

/**
 * Validates test answers format
 */
export function validateTestAnswers(
  answers: Record<string, string>,
  questions: TestQuestion[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const questionIds = new Set(questions.map(q => q.id));
  
  // Check if all questions have answers
  for (const question of questions) {
    if (!answers[question.id]) {
      errors.push(`Question ${question.order} is not answered`);
    }
  }
  
  // Check for invalid question IDs in answers
  for (const answeredQuestionId of Object.keys(answers)) {
    if (!questionIds.has(answeredQuestionId)) {
      errors.push(`Invalid question ID: ${answeredQuestionId}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Gets test statistics for analytics
 */
export interface TestStatistics {
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  averageTimeSpent: number;
  difficultyDistribution: Record<string, number>;
  commonWrongAnswers: Array<{
    questionId: string;
    question: string;
    wrongAnswerCount: number;
    correctAnswer: string;
  }>;
}

/**
 * Calculates comprehensive test statistics
 */
export function calculateTestStatistics(
  attempts: TestAttempt[],
  questions: TestQuestion[]
): TestStatistics {
  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      passRate: 0,
      averageTimeSpent: 0,
      difficultyDistribution: {},
      commonWrongAnswers: [],
    };
  }

  const totalAttempts = attempts.length;
  const averageScore = attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.totalPoints * 100), 0) / totalAttempts;
  const passedAttempts = attempts.filter(attempt => attempt.passed).length;
  const passRate = (passedAttempts / totalAttempts) * 100;
  
  // Calculate average time spent (assuming completedAt and startedAt are available)
  const averageTimeSpent = attempts.reduce((sum, attempt) => {
    if (attempt.completedAt) {
      const timeSpent = (attempt.completedAt.getTime() - attempt.startedAt.getTime()) / (1000 * 60);
      return sum + timeSpent;
    }
    return sum;
  }, 0) / attempts.filter(a => a.completedAt).length || 0;

  // Analyze wrong answers (this would need more detailed answer tracking)
  const commonWrongAnswers = questions.map(question => ({
    questionId: question.id,
    question: question.question,
    wrongAnswerCount: 0, // This would need to be calculated from detailed attempt data
    correctAnswer: question.correctAnswer,
  }));

  return {
    totalAttempts,
    averageScore: Math.round(averageScore),
    passRate: Math.round(passRate),
    averageTimeSpent: Math.round(averageTimeSpent),
    difficultyDistribution: {},
    commonWrongAnswers,
  };
}

/**
 * Formats test results for display
 */
export function formatTestResults(result: TestResult): {
  scoreText: string;
  statusText: string;
  statusColor: string;
  performanceText: string;
} {
  const scoreText = `${result.correctAnswers}/${result.totalQuestions} (${result.percentage}%)`;
  const statusText = result.passed ? 'PASSED' : 'FAILED';
  const statusColor = result.passed ? 'text-green-600' : 'text-red-600';
  
  let performanceText = 'Below Average';
  if (result.percentage >= 90) {performanceText = 'Excellent';}
  else if (result.percentage >= 80) {performanceText = 'Very Good';}
  else if (result.percentage >= 70) {performanceText = 'Good';}
  else if (result.percentage >= 60) {performanceText = 'Average';}
  
  return {
    scoreText,
    statusText,
    statusColor,
    performanceText,
  };
}