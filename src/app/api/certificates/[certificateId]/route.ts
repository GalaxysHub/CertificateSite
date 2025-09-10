import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { logCertificateAction } from '@/lib/certificate';
import { CertificateGenerator } from '@/lib/certificate-generator';

interface RouteParams {
  params: {
    certificateId: string;
  };
}

export async function GET(
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
            id: true,
            title: true,
            category: {
              select: {
                name: true,
                type: true,
              },
            },
          },
        },
        testAttempt: {
          select: {
            id: true,
            score: true,
            passed: true,
            completedAt: true,
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

    // Check access permissions
    const isOwner = certificate.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Log certificate view
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await logCertificateAction(
      certificateId,
      'VIEWED',
      session.user.id,
      ipAddress,
      userAgent
    );

    // Increment view count
    await db.certificate.update({
      where: { id: certificateId },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      certificate,
    });
  } catch (error) {
    console.error('Error retrieving certificate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const certificate = await db.certificate.findUnique({
      where: { id: certificateId },
      select: { userId: true },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const isOwner = certificate.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Use revoke instead of delete for audit purposes
    const generator = CertificateGenerator.getInstance();
    const result = await generator.revokeCertificate(
      certificateId,
      'Deleted by user request',
      {
        performedBy: session.user.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Certificate revoked successfully',
    });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}