import { Test, Question, TestAttempt } from '@prisma/client';
import { TestQuestion, TestSession, TestResult } from './test-utils';
import { db } from './db';

// Test session storage (in production, use Redis or database)
const testSessions = new Map<string, TestSession>();

/**
 * Creates a new test session for a user
 */
export async function startTestSession(
  userId: string,
  testId: string
): Promise<{ sessionId: string; testSession: TestSession }> {
  // Fetch test with questions
  const test = await db.test.findUnique({
    where: { id: testId },
    include: {
      questions: {
        orderBy: { order: 'asc' }
      },
      category: true
    }
  });

  if (!test) {
    throw new Error('Test not found');
  }

  if (!test.isPublished) {
    throw new Error('Test is not available');
  }

  // Create test attempt record
  const attempt = await db.testAttempt.create({
    data: {
      testId,
      userId,
      answers: {},
      score: 0,
      totalPoints: test.questions.reduce((sum, q) => sum + q.points, 0),
      passed: false,
      startedAt: new Date(),
    }
  });

  // Convert questions to TestQuestion format
  const testQuestions: TestQuestion[] = test.questions.map(q => ({
    ...q,
    options: Array.isArray(q.options) ? q.options as string[] : []
  }));

  // Create test session
  const testSession: TestSession = {
    testId: test.id,
    questions: testQuestions,
    startTime: new Date(),
    timeLimit: test.duration,
    currentQuestionIndex: 0,
    answers: {},
  };

  const sessionId = attempt.id;
  testSessions.set(sessionId, testSession);

  return { sessionId, testSession };
}

/**
 * Gets an active test session
 */
export function getTestSession(sessionId: string): TestSession | null {
  return testSessions.get(sessionId) || null;
}

/**
 * Updates a test session with a new answer
 */
export function updateTestSession(
  sessionId: string,
  questionId: string,
  answer: string
): TestSession | null {
  const session = testSessions.get(sessionId);
  if (!session) {return null;}

  // Update answer
  session.answers[questionId] = answer;

  // Save updated session
  testSessions.set(sessionId, session);

  return session;
}

/**
 * Moves to the next question in the test session
 */
export function nextQuestion(sessionId: string): TestSession | null {
  const session = testSessions.get(sessionId);
  if (!session) {return null;}

  if (session.currentQuestionIndex < session.questions.length - 1) {
    session.currentQuestionIndex++;
    testSessions.set(sessionId, session);
  }

  return session;
}

/**
 * Moves to the previous question in the test session
 */
export function previousQuestion(sessionId: string): TestSession | null {
  const session = testSessions.get(sessionId);
  if (!session) {return null;}

  if (session.currentQuestionIndex > 0) {
    session.currentQuestionIndex--;
    testSessions.set(sessionId, session);
  }

  return session;
}

/**
 * Jumps to a specific question in the test session
 */
export function goToQuestion(sessionId: string, questionIndex: number): TestSession | null {
  const session = testSessions.get(sessionId);
  if (!session) {return null;}

  if (questionIndex >= 0 && questionIndex < session.questions.length) {
    session.currentQuestionIndex = questionIndex;
    testSessions.set(sessionId, session);
  }

  return session;
}

/**
 * Submits a test session and calculates results
 */
export async function submitTestSession(
  sessionId: string,
  userId: string
): Promise<TestResult & { attemptId: string }> {
  const session = testSessions.get(sessionId);
  if (!session) {
    throw new Error('Test session not found');
  }

  const completedAt = new Date();

  // Get original questions for scoring
  const test = await db.test.findUnique({
    where: { id: session.testId },
    include: {
      questions: {
        orderBy: { order: 'asc' }
      },
      category: true
    }
  });

  if (!test) {
    throw new Error('Test not found');
  }

  const originalQuestions: TestQuestion[] = test.questions.map(q => ({
    ...q,
    options: Array.isArray(q.options) ? q.options as string[] : []
  }));

  // Calculate results
  let correctAnswers = 0;
  let totalPoints = 0;
  let earnedPoints = 0;

  originalQuestions.forEach(question => {
    const userAnswer = session.answers[question.id];
    totalPoints += question.points;
    
    if (userAnswer === question.correctAnswer) {
      correctAnswers++;
      earnedPoints += question.points;
    }
  });

  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const timeSpent = Math.round((completedAt.getTime() - session.startTime.getTime()) / (1000 * 60));
  const passed = percentage >= test.passingScore;

  const result: TestResult = {
    score: earnedPoints,
    totalPoints,
    percentage,
    passed,
    correctAnswers,
    totalQuestions: originalQuestions.length,
    timeSpent,
  };

  // Update the test attempt in database
  const updatedAttempt = await db.testAttempt.update({
    where: { id: sessionId },
    data: {
      answers: session.answers,
      score: earnedPoints,
      totalPoints,
      passed,
      completedAt,
    }
  });

  // Clean up session
  testSessions.delete(sessionId);

  return {
    ...result,
    attemptId: updatedAttempt.id,
  };
}

/**
 * Gets the current question for a test session
 */
export function getCurrentQuestion(sessionId: string): TestQuestion | null {
  const session = testSessions.get(sessionId);
  if (!session) {return null;}

  return session.questions[session.currentQuestionIndex] || null;
}

/**
 * Gets the progress of a test session
 */
export function getTestProgress(sessionId: string): {
  currentQuestion: number;
  totalQuestions: number;
  percentage: number;
  answeredQuestions: number;
  remainingTime: number;
} | null {
  const session = testSessions.get(sessionId);
  if (!session) {return null;}

  const answeredQuestions = Object.keys(session.answers).length;
  const currentTime = new Date();
  const elapsedMinutes = Math.floor((currentTime.getTime() - session.startTime.getTime()) / (1000 * 60));
  const remainingTime = Math.max(0, session.timeLimit - elapsedMinutes);

  return {
    currentQuestion: session.currentQuestionIndex + 1,
    totalQuestions: session.questions.length,
    percentage: Math.round((answeredQuestions / session.questions.length) * 100),
    answeredQuestions,
    remainingTime,
  };
}

/**
 * Checks if a test session is valid and not expired
 */
export function isValidSession(sessionId: string): boolean {
  const session = testSessions.get(sessionId);
  if (!session) {return false;}

  const currentTime = new Date();
  const elapsedMinutes = Math.floor((currentTime.getTime() - session.startTime.getTime()) / (1000 * 60));
  
  return elapsedMinutes < session.timeLimit;
}

/**
 * Gets all answers for a test session
 */
export function getSessionAnswers(sessionId: string): Record<string, string> | null {
  const session = testSessions.get(sessionId);
  return session ? session.answers : null;
}

/**
 * Auto-submits expired test sessions
 */
export async function autoSubmitExpiredSession(sessionId: string, userId: string): Promise<TestResult | null> {
  const session = testSessions.get(sessionId);
  if (!session) {return null;}

  if (!isValidSession(sessionId)) {
    return await submitTestSession(sessionId, userId);
  }

  return null;
}

/**
 * Pauses a test session (saves current state)
 */
export async function pauseTestSession(sessionId: string): Promise<boolean> {
  const session = testSessions.get(sessionId);
  if (!session) {return false;}

  // Save current session state to database
  await db.testAttempt.update({
    where: { id: sessionId },
    data: {
      answers: session.answers,
    }
  });

  return true;
}

/**
 * Resumes a paused test session
 */
export async function resumeTestSession(sessionId: string): Promise<TestSession | null> {
  // Try to get from memory first
  let session = testSessions.get(sessionId);
  if (session && isValidSession(sessionId)) {
    return session;
  }

  // Load from database if not in memory
  const attempt = await db.testAttempt.findUnique({
    where: { id: sessionId },
    include: {
      test: {
        include: {
          questions: {
            orderBy: { order: 'asc' }
          }
        }
      }
    }
  });

  if (!attempt || attempt.completedAt) {
    return null;
  }

  // Recreate session from database
  const testQuestions: TestQuestion[] = attempt.test.questions.map(q => ({
    ...q,
    options: Array.isArray(q.options) ? q.options as string[] : []
  }));

  session = {
    testId: attempt.testId,
    questions: testQuestions,
    startTime: attempt.startedAt,
    timeLimit: attempt.test.duration,
    currentQuestionIndex: 0,
    answers: (attempt.answers as Record<string, string>) || {},
  };

  // Check if session is still valid (not expired)
  if (!isValidSession(sessionId)) {
    return null;
  }

  testSessions.set(sessionId, session);
  return session;
}

/**
 * Gets test session statistics
 */
export function getSessionStatistics(): {
  activeSessions: number;
  totalSessions: number;
  averageSessionTime: number;
} {
  const activeSessions = testSessions.size;
  const currentTime = new Date();
  
  let totalSessionTime = 0;
  let validSessions = 0;

  testSessions.forEach(session => {
    const elapsedTime = (currentTime.getTime() - session.startTime.getTime()) / (1000 * 60);
    if (elapsedTime < session.timeLimit) {
      totalSessionTime += elapsedTime;
      validSessions++;
    }
  });

  return {
    activeSessions: validSessions,
    totalSessions: activeSessions,
    averageSessionTime: validSessions > 0 ? Math.round(totalSessionTime / validSessions) : 0,
  };
}

/**
 * Cleanup expired sessions (should be run periodically)
 */
export function cleanupExpiredSessions(): number {
  let cleanedCount = 0;
  const currentTime = new Date();

  testSessions.forEach((session, sessionId) => {
    const elapsedMinutes = Math.floor((currentTime.getTime() - session.startTime.getTime()) / (1000 * 60));
    if (elapsedMinutes >= session.timeLimit) {
      testSessions.delete(sessionId);
      cleanedCount++;
    }
  });

  return cleanedCount;
}

/**
 * Gets detailed test session info for debugging
 */
export function getSessionDebugInfo(sessionId: string): any {
  const session = testSessions.get(sessionId);
  if (!session) {return null;}

  const currentTime = new Date();
  const elapsedMinutes = Math.floor((currentTime.getTime() - session.startTime.getTime()) / (1000 * 60));

  return {
    sessionId,
    testId: session.testId,
    startTime: session.startTime,
    currentTime,
    elapsedMinutes,
    timeLimit: session.timeLimit,
    isExpired: elapsedMinutes >= session.timeLimit,
    currentQuestionIndex: session.currentQuestionIndex,
    totalQuestions: session.questions.length,
    answeredQuestions: Object.keys(session.answers).length,
    answers: session.answers,
  };
}