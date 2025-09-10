import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only allow admin access to analytics
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const timeframe = searchParams.get('timeframe') || '30'; // days
    const userId = searchParams.get('userId');

    const timeframeDays = parseInt(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeframeDays);

    // Build where clause
    const whereClause: any = {
      createdAt: {
        gte: startDate,
      },
    };

    if (userId) {
      whereClause.certificate = {
        userId,
      };
    }

    // Get certificate statistics
    const [
      totalCertificates,
      validCertificates,
      revokedCertificates,
      expiredCertificates,
      certificatesWithEmail,
      recentAuditLogs,
      certificatesByTemplate,
      certificatesByAction,
      topDownloads,
      topViews,
    ] = await Promise.all([
      // Total certificates
      db.certificate.count({
        where: userId ? { userId } : {},
      }),

      // Valid certificates
      db.certificate.count({
        where: {
          isValid: true,
          ...(userId ? { userId } : {}),
        },
      }),

      // Revoked certificates
      db.certificate.count({
        where: {
          isValid: false,
          ...(userId ? { userId } : {}),
        },
      }),

      // Expired certificates
      db.certificate.count({
        where: {
          expiryDate: {
            lt: new Date(),
          },
          isValid: true,
          ...(userId ? { userId } : {}),
        },
      }),

      // Certificates with email sent
      db.certificate.count({
        where: {
          emailSent: true,
          ...(userId ? { userId } : {}),
        },
      }),

      // Recent audit logs
      db.certificateAuditLog.findMany({
        where: whereClause,
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: {
          certificate: {
            select: {
              id: true,
              title: true,
              recipientName: true,
              verificationCode: true,
            },
          },
        },
      }),

      // Certificates by template type
      db.certificate.groupBy({
        by: ['templateType'],
        _count: {
          id: true,
        },
        where: userId ? { userId } : {},
      }),

      // Actions by type (from audit logs)
      db.certificateAuditLog.groupBy({
        by: ['action'],
        _count: {
          id: true,
        },
        where: whereClause,
      }),

      // Top downloaded certificates
      db.certificate.findMany({
        where: userId ? { userId } : {},
        take: 10,
        orderBy: { downloadCount: 'desc' },
        select: {
          id: true,
          title: true,
          recipientName: true,
          downloadCount: true,
          verificationCode: true,
        },
      }),

      // Top viewed certificates
      db.certificate.findMany({
        where: userId ? { userId } : {},
        take: 10,
        orderBy: { viewCount: 'desc' },
        select: {
          id: true,
          title: true,
          recipientName: true,
          viewCount: true,
          verificationCode: true,
        },
      }),
    ]);

    // Calculate trends (compare with previous period)
    const previousPeriodStart = new Date();
    previousPeriodStart.setDate(previousPeriodStart.getDate() - (timeframeDays * 2));
    previousPeriodStart.setDate(previousPeriodStart.getDate() + timeframeDays);

    const previousPeriodCertificates = await db.certificate.count({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: startDate,
        },
        ...(userId ? { userId } : {}),
      },
    });

    const currentPeriodCertificates = await db.certificate.count({
      where: {
        createdAt: {
          gte: startDate,
        },
        ...(userId ? { userId } : {}),
      },
    });

    const trend = previousPeriodCertificates > 0 
      ? ((currentPeriodCertificates - previousPeriodCertificates) / previousPeriodCertificates) * 100
      : 0;

    // Get daily certificate generation for the period
    const dailyStats = await db.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM "Certificate"
      WHERE created_at >= ${startDate}
        ${userId ? db.$queryRaw`AND user_id = ${userId}` : db.$queryRaw``}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalCertificates,
          validCertificates,
          revokedCertificates,
          expiredCertificates,
          certificatesWithEmail,
          trend: Math.round(trend * 100) / 100,
        },
        distributions: {
          byTemplate: certificatesByTemplate.map(item => ({
            template: item.templateType,
            count: item._count.id,
          })),
          byAction: certificatesByAction.map(item => ({
            action: item.action,
            count: item._count.id,
          })),
        },
        topPerformers: {
          mostDownloaded: topDownloads,
          mostViewed: topViews,
        },
        recentActivity: recentAuditLogs.map(log => ({
          id: log.id,
          action: log.action,
          certificate: log.certificate,
          performedBy: log.performedBy,
          ipAddress: log.ipAddress,
          createdAt: log.createdAt,
          details: log.details,
        })),
        dailyStats,
        timeframe: {
          days: timeframeDays,
          startDate,
          endDate: new Date(),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching certificate analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}