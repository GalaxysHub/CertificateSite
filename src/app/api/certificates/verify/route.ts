import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logCertificateAction, isValidVerificationCodeFormat, isCertificateExpired } from '@/lib/certificate';
import { z } from 'zod';

const verifySchema = z.object({
  verificationCode: z.string().min(1, 'Verification code is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { verificationCode } = verifySchema.parse(body);

    // Basic format validation
    if (!isValidVerificationCodeFormat(verificationCode)) {
      return NextResponse.json({
        success: false,
        isValid: false,
        error: 'Invalid verification code format',
      });
    }

    // Look up certificate
    const certificate = await db.certificate.findUnique({
      where: { verificationCode },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        test: {
          select: {
            title: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        testAttempt: {
          select: {
            score: true,
            completedAt: true,
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json({
        success: true,
        isValid: false,
        error: 'Certificate not found',
      });
    }

    // Check if certificate is valid
    const isRevoked = !certificate.isValid;
    const isExpired = isCertificateExpired(certificate.expiryDate);

    const isValid = !isRevoked && !isExpired;

    // Log verification attempt
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await logCertificateAction(
      certificate.id,
      'VERIFIED',
      null, // Public verification, no user
      ipAddress,
      userAgent,
      {
        isValid,
        reason: isRevoked ? 'revoked' : isExpired ? 'expired' : 'valid',
      }
    );

    const response: any = {
      success: true,
      isValid,
      verificationCode,
    };

    if (isValid) {
      response.certificateData = {
        recipientName: certificate.recipientName,
        testName: certificate.testName || certificate.test?.title,
        issueDate: certificate.issueDate.toISOString().split('T')[0],
        score: certificate.score,
        proficiencyLevel: certificate.proficiencyLevel,
        organizationName: 'Certificate Testing Platform',
        testCategory: certificate.test?.category?.name,
        completionDate: certificate.testAttempt?.completedAt?.toISOString().split('T')[0],
      };
    } else {
      response.error = isRevoked 
        ? 'Certificate has been revoked'
        : 'Certificate has expired';
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error verifying certificate:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        isValid: false,
        error: 'Invalid input data',
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      isValid: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

// GET endpoint for URL-based verification (from QR codes)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const verificationCode = searchParams.get('code');

    if (!verificationCode) {
      return NextResponse.json({
        success: false,
        isValid: false,
        error: 'Verification code is required',
      }, { status: 400 });
    }

    // Reuse POST logic
    const postRequest = new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ verificationCode }),
    });

    return this.POST(postRequest);
  } catch (error) {
    console.error('Error in GET verification:', error);
    return NextResponse.json({
      success: false,
      isValid: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}