import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { logCertificateAction } from '@/lib/certificate';
import fs from 'fs/promises';
import path from 'path';

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
      select: {
        id: true,
        userId: true,
        title: true,
        filePath: true,
        isValid: true,
        recipientName: true,
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
        { error: 'Certificate has been revoked' },
        { status: 410 }
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

    if (!certificate.filePath) {
      return NextResponse.json(
        { error: 'Certificate file not found' },
        { status: 404 }
      );
    }

    // Read the PDF file
    const fullPath = path.join(process.cwd(), 'public', certificate.filePath);
    
    try {
      const fileBuffer = await fs.readFile(fullPath);
      
      // Log download action
      const ipAddress = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';

      await logCertificateAction(
        certificateId,
        'DOWNLOADED',
        session.user.id,
        ipAddress,
        userAgent
      );

      // Increment download count
      await db.certificate.update({
        where: { id: certificateId },
        data: { downloadCount: { increment: 1 } },
      });

      // Generate filename
      const sanitizedTitle = certificate.title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '_');
      const sanitizedName = certificate.recipientName.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '_');
      const fileName = `${sanitizedTitle}_${sanitizedName}.pdf`;

      // Return PDF with appropriate headers
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Cache-Control': 'private, no-cache',
        },
      });
    } catch (fileError) {
      console.error('Error reading certificate file:', fileError);
      return NextResponse.json(
        { error: 'Certificate file could not be read' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error downloading certificate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}