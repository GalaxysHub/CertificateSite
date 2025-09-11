import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { startTestSession } from '@/lib/test-session';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    // Get user session (optional for anonymous users)
    const session = await getServerSession(authOptions);
    const { testId } = await params;

    // Start new test session (with or without user ID)
    const { sessionId, testSession } = await startTestSession(
      session?.user?.id || null, // Allow null for anonymous users
      testId
    );

    return NextResponse.json({
      sessionId,
      testSession: {
        testId: testSession.testId,
        startTime: testSession.startTime,
        timeLimit: testSession.timeLimit,
        totalQuestions: testSession.questions.length,
        currentQuestionIndex: testSession.currentQuestionIndex,
      }
    });

  } catch (error) {
    console.error('Error starting test session:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Test not found') {
        return NextResponse.json(
          { error: 'Test not found' },
          { status: 404 }
        );
      }
      if (error.message === 'Test is not available') {
        return NextResponse.json(
          { error: 'Test is not available' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to start test session' },
      { status: 500 }
    );
  }
}