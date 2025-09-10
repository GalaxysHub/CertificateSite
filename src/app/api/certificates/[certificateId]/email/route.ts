import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { EmailService } from '@/lib/email';
import { logCertificateAction } from '@/lib/certificate';
import { z } from 'zod';

interface RouteParams {
  params: {
    certificateId: string;
  };
}

const emailShareSchema = z.object({
  email: z.string().email('Valid email address is required'),
  message: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { certificateId } = params;
    const body = await request.json();
    const { email, message } = emailShareSchema.parse(body);

    // Get certificate with full details
    const certificate = await db.certificate.findUnique({
      where: { id: certificateId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        test: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    if (!certificate.isValid) {
      return NextResponse.json(
        { error: 'Cannot share revoked certificate' },
        { status: 400 }
      );
    }

    // Check access permissions
    const isOwner = certificate.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Prepare email data
    const baseUrl = process.env.NEXTAUTH_URL || 'https://localhost:3000';
    const certificateUrl = `${baseUrl}/api/certificates/${certificateId}/download`;
    const verificationUrl = `${baseUrl}/verify-certificate?code=${certificate.verificationCode}`;

    const emailData = {
      to: email,
      recipientName: certificate.recipientName,
      testName: certificate.testName || certificate.test?.title || 'Assessment',
      score: certificate.score,
      proficiencyLevel: certificate.proficiencyLevel,
      verificationCode: certificate.verificationCode,
      certificateUrl,
      verificationUrl,
    };

    // Send email
    const emailService = EmailService.getInstance();
    const emailResult = await emailService.sendCertificate(emailData);

    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    // Update certificate email status
    await db.certificate.update({
      where: { id: certificateId },
      data: {
        emailSent: true,
        emailSentAt: new Date(),
      },
    });

    // Log email action
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await logCertificateAction(
      certificateId,
      'EMAILED',
      session.user.id,
      ipAddress,
      userAgent,
      {
        recipientEmail: email,
        customMessage: message,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Certificate sent successfully',
    });
  } catch (error) {
    console.error('Error sending certificate email:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}