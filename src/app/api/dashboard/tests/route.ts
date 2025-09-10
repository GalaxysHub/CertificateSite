import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const status = searchParams.get('status') || 'all'; // all, completed, available, in-progress
    
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const whereClause: any = {
      isPublished: true
    };

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (category) {
      whereClause.category = { name: category };
    }

    if (difficulty) {
      whereClause.difficulty = difficulty;
    }

    // Get available tests with user attempt information
    const tests = await db.test.findMany({
      where: whereClause,
      include: {
        category: true,
        creator: {
          select: { name: true, id: true }
        },
        attempts: {
          where: { userId },
          select: {
            id: true,
            score: true,
            passed: true,
            completedAt: true,
            startedAt: true
          },
          orderBy: { completedAt: 'desc' }
        },
        _count: {
          select: {
            questions: true,
            attempts: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ],
      skip,
      take: limit
    });

    // Get total count for pagination
    const totalCount = await db.test.count({ where: whereClause });

    // Filter based on status
    let filteredTests = tests;
    if (status !== 'all') {
      filteredTests = tests.filter(test => {
        const userAttempts = test.attempts;
        const hasCompletedAttempt = userAttempts.some(attempt => attempt.completedAt);
        const hasInProgressAttempt = userAttempts.some(attempt => !attempt.completedAt);

        switch (status) {
          case 'completed':
            return hasCompletedAttempt;
          case 'available':
            return !hasCompletedAttempt && !hasInProgressAttempt;
          case 'in-progress':
            return hasInProgressAttempt;
          default:
            return true;
        }
      });
    }

    // Format response data
    const formattedTests = filteredTests.map(test => {
      const userAttempts = test.attempts;
      const bestAttempt = userAttempts
        .filter(a => a.completedAt)
        .sort((a, b) => b.score - a.score)[0];
      
      const latestAttempt = userAttempts[0];
      const inProgress = userAttempts.some(a => !a.completedAt);

      return {
        id: test.id,
        title: test.title,
        description: test.description,
        category: test.category.name,
        categoryType: test.category.type,
        difficulty: test.difficulty,
        level: test.level,
        duration: test.duration,
        totalQuestions: test._count.questions,
        totalAttempts: test._count.attempts,
        passingScore: test.passingScore,
        creator: test.creator.name,
        userProgress: {
          attempts: userAttempts.length,
          bestScore: bestAttempt?.score || null,
          latestScore: latestAttempt?.score || null,
          passed: bestAttempt?.passed || false,
          inProgress,
          lastAttemptDate: latestAttempt?.completedAt || latestAttempt?.startedAt
        }
      };
    });

    // Get recommended tests based on user history
    const recommendedTests = await getRecommendedTests(userId);

    // Get popular tests
    const popularTests = await db.test.findMany({
      where: { isPublished: true },
      include: {
        category: true,
        _count: {
          select: { attempts: true }
        }
      },
      orderBy: {
        attempts: {
          _count: 'desc'
        }
      },
      take: 5
    });

    return NextResponse.json({
      tests: formattedTests,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      },
      recommended: recommendedTests,
      popular: popularTests.map(test => ({
        id: test.id,
        title: test.title,
        category: test.category.name,
        difficulty: test.difficulty,
        totalAttempts: test._count.attempts
      }))
    });
  } catch (error) {
    console.error("Dashboard tests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tests data" },
      { status: 500 }
    );
  }
}

async function getRecommendedTests(userId: string) {
  try {
    // Get user's completed test categories and difficulties
    const userHistory = await db.testAttempt.findMany({
      where: {
        userId,
        completedAt: { not: null }
      },
      include: {
        test: {
          include: { category: true }
        }
      }
    });

    if (userHistory.length === 0) {
      // New user - recommend beginner tests from popular categories
      return db.test.findMany({
        where: {
          isPublished: true,
          difficulty: 'BEGINNER'
        },
        include: {
          category: true,
          _count: { select: { attempts: true } }
        },
        orderBy: {
          attempts: { _count: 'desc' }
        },
        take: 3
      });
    }

    // Get categories user has attempted
    const attemptedCategories = [...new Set(userHistory.map(h => h.test.categoryId))];
    
    // Get average performance to suggest appropriate difficulty
    const avgScore = userHistory.reduce((sum, h) => sum + h.score, 0) / userHistory.length;
    let suggestedDifficulty: string[];
    
    if (avgScore >= 80) {
      suggestedDifficulty = ['INTERMEDIATE', 'ADVANCED'];
    } else if (avgScore >= 60) {
      suggestedDifficulty = ['BEGINNER', 'INTERMEDIATE'];
    } else {
      suggestedDifficulty = ['BEGINNER'];
    }

    return db.test.findMany({
      where: {
        isPublished: true,
        categoryId: { in: attemptedCategories },
        difficulty: { in: suggestedDifficulty },
        id: {
          notIn: userHistory.map(h => h.testId)
        }
      },
      include: {
        category: true,
        _count: { select: { attempts: true } }
      },
      orderBy: {
        attempts: { _count: 'desc' }
      },
      take: 3
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    return [];
  }
}