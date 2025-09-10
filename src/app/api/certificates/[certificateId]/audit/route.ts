import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

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

    // Get certificate first to check permissions
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

    // Check access permissions
    const isOwner = certificate.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const action = searchParams.get('action');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { certificateId };
    
    if (action) {
      where.action = action;
    }

    // Get audit logs with pagination
    const [auditLogs, totalCount] = await Promise.all([
      db.certificateAuditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          certificate: {
            select: {
              title: true,
              recipientName: true,
              verificationCode: true,
            },
          },
        },
      }),
      db.certificateAuditLog.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    // Get action summary
    const actionSummary = await db.certificateAuditLog.groupBy({
      by: ['action'],
      where: { certificateId },
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      success: true,
      auditLogs: auditLogs.map(log => ({
        id: log.id,
        action: log.action,
        performedBy: log.performedBy,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        details: log.details,
        createdAt: log.createdAt,
        certificate: log.certificate,
      })),
      summary: {
        totalActions: totalCount,
        actionBreakdown: actionSummary.map(item => ({
          action: item.action,
          count: item._count.id,
        })),
      },
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error retrieving certificate audit logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}