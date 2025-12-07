import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pauseTestSession, isValidSession } from '@/lib/test-session';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { sessionId } = await params;

    if (!isValidSession(sessionId)) {
      return NextResponse.json(
        { error: 'Test session has expired' },
        { status: 410 }
      );
    }

    const success = await pauseTestSession(sessionId);

    if (!success) {
      return NextResponse.json(
        { error: 'Test session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Test session paused successfully'
    });

  } catch (error) {
    console.error('Error pausing test session:', error);
    return NextResponse.json(
      { error: 'Failed to pause test session' },
      { status: 500 }
    );
  }
}