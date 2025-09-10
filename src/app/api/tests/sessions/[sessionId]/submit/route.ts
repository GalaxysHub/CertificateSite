import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { submitTestSession, getTestSession, isValidSession, autoSubmitExpiredSession } from '@/lib/test-session';
import { db } from '@/lib/db';
import { CertificateGenerator } from '@/lib/certificate-generator';

export async function POST(
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
    const { forceSubmit = false } = body;

    // Check if session exists
    const testSession = getTestSession(sessionId);
    if (!testSession) {
      return NextResponse.json(
        { error: 'Test session not found' },
        { status: 404 }
      );
    }

    // Check if test session has expired
    if (!isValidSession(sessionId) && !forceSubmit) {
      // Auto-submit expired session
      const expiredResult = await autoSubmitExpiredSession(sessionId, session.user.id);
      
      if (expiredResult) {
        return NextResponse.json({
          result: expiredResult,
          expired: true,
          message: 'Test was automatically submitted due to time expiration'
        });
      }
      
      return NextResponse.json(
        { error: 'Test session has expired' },
        { status: 410 }
      );
    }

    // Submit the test session
    const result = await submitTestSession(sessionId, session.user.id);

    // Get test details for certificate generation
    const test = await db.test.findUnique({
      where: { id: testSession.testId },
      include: {
        category: true
      }
    });

    // Generate certificate if passed using the comprehensive certificate system
    let certificateResult = null;
    if (result.passed && test && result.attemptId) {
      try {
        const generator = CertificateGenerator.getInstance();
        
        // Get request metadata for audit logging
        const ipAddress = request.headers.get('x-forwarded-for') || 
                         request.headers.get('x-real-ip') || 
                         'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        certificateResult = await generator.generateCertificate({
          testAttemptId: result.attemptId,
          recipientName: session.user.name || 'Test Taker',
          performedBy: session.user.id,
          ipAddress,
          userAgent,
        });

        if (!certificateResult.success) {
          console.error('Certificate generation failed:', certificateResult.error);
        }
      } catch (certError) {
        console.error('Error generating certificate:', certError);
        // Don't fail the submission if certificate creation fails
      }
    }

    return NextResponse.json({
      result,
      certificate: certificateResult?.success ? {
        id: certificateResult.certificateId,
        verificationCode: certificateResult.verificationCode,
        filePath: certificateResult.filePath,
      } : null,
      test: test ? {
        id: test.id,
        title: test.title,
        category: test.category.name,
        passingScore: test.passingScore
      } : null
    });

  } catch (error) {
    console.error('Error submitting test session:', error);
    return NextResponse.json(
      { error: 'Failed to submit test session' },
      { status: 500 }
    );
  }
}