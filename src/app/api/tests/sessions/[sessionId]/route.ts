import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { 
  getTestSession, 
  updateTestSession, 
  getCurrentQuestion,
  getTestProgress,
  isValidSession,
  resumeTestSession,
} from '@/lib/test-session';

// Get current test session state
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const sessionId = params.sessionId;

    // Try to get session from memory or resume from database
    let testSession = getTestSession(sessionId);
    
    if (!testSession) {
      testSession = await resumeTestSession(sessionId);
    }

    if (!testSession) {
      return NextResponse.json(
        { error: 'Test session not found' },
        { status: 404 }
      );
    }

    if (!isValidSession(sessionId)) {
      return NextResponse.json(
        { error: 'Test session has expired' },
        { status: 410 }
      );
    }

    const currentQuestion = getCurrentQuestion(sessionId);
    const progress = getTestProgress(sessionId);

    return NextResponse.json({
      testSession: {
        testId: testSession.testId,
        startTime: testSession.startTime,
        timeLimit: testSession.timeLimit,
        currentQuestionIndex: testSession.currentQuestionIndex,
        totalQuestions: testSession.questions.length,
        questions: testSession.questions, // Include all questions for review mode
      },
      currentQuestion,
      progress,
      answers: testSession.answers,
    });

  } catch (error) {
    console.error('Error getting test session:', error);
    return NextResponse.json(
      { error: 'Failed to get test session' },
      { status: 500 }
    );
  }
}

// Update test session with answer
export async function PATCH(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const sessionId = params.sessionId;
    const body = await request.json();
    
    const { questionId, answer, action } = body;

    if (!isValidSession(sessionId)) {
      return NextResponse.json(
        { error: 'Test session has expired' },
        { status: 410 }
      );
    }

    // Update answer if provided
    let updatedSession = getTestSession(sessionId);
    
    if (questionId && answer !== undefined) {
      updatedSession = updateTestSession(sessionId, questionId, answer);
    }

    if (!updatedSession) {
      return NextResponse.json(
        { error: 'Test session not found' },
        { status: 404 }
      );
    }

    // Handle navigation actions
    if (action === 'next') {
      const { nextQuestion } = await import('@/lib/test-session');
      updatedSession = nextQuestion(sessionId);
    } else if (action === 'previous') {
      const { previousQuestion } = await import('@/lib/test-session');
      updatedSession = previousQuestion(sessionId);
    } else if (action === 'goto' && body.questionIndex !== undefined) {
      const { goToQuestion } = await import('@/lib/test-session');
      updatedSession = goToQuestion(sessionId, body.questionIndex);
    }

    if (!updatedSession) {
      return NextResponse.json(
        { error: 'Failed to update session' },
        { status: 500 }
      );
    }

    const currentQuestion = getCurrentQuestion(sessionId);
    const progress = getTestProgress(sessionId);

    return NextResponse.json({
      testSession: {
        testId: updatedSession.testId,
        startTime: updatedSession.startTime,
        timeLimit: updatedSession.timeLimit,
        currentQuestionIndex: updatedSession.currentQuestionIndex,
        totalQuestions: updatedSession.questions.length,
      },
      currentQuestion,
      progress,
      answers: updatedSession.answers,
    });

  } catch (error) {
    console.error('Error updating test session:', error);
    return NextResponse.json(
      { error: 'Failed to update test session' },
      { status: 500 }
    );
  }
}