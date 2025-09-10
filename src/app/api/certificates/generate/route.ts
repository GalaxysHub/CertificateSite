import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CertificateGenerator } from '@/lib/certificate-generator';
import { logCertificateAction } from '@/lib/certificate';
import { z } from 'zod';

const generateCertificateSchema = z.object({
  testAttemptId: z.string().min(1, 'Test attempt ID is required'),
  templateType: z.enum(['STANDARD', 'PROFESSIONAL', 'ACADEMIC', 'TECHNICAL', 'LANGUAGE_PROFICIENCY']).optional(),
  recipientName: z.string().optional(),
  customData: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = generateCertificateSchema.parse(body);

    // Get request metadata for audit logging
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const generator = CertificateGenerator.getInstance();
    const result = await generator.generateCertificate({
      ...validatedData,
      performedBy: session.user.id,
      ipAddress,
      userAgent,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      certificate: {
        id: result.certificateId,
        verificationCode: result.verificationCode,
        filePath: result.filePath,
      },
    });
  } catch (error) {
    console.error('Error in certificate generation API:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}