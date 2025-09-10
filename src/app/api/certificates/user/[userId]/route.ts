import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
  params: {
    userId: string;
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

    const { userId } = params;

    // Check access permissions
    const isOwner = userId === session.user.id;
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
    const limit = parseInt(searchParams.get('limit') || '10');
    const isValid = searchParams.get('isValid');
    const testId = searchParams.get('testId');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId };
    
    if (isValid !== null) {
      where.isValid = isValid === 'true';
    }
    
    if (testId) {
      where.testId = testId;
    }

    // Get certificates with pagination
    const [certificates, totalCount] = await Promise.all([
      db.certificate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
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
      }),
      db.certificate.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      certificates,
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
    console.error('Error retrieving user certificates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}