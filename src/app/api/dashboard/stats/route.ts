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

    // Get user statistics
    const [
      userAttempts,
      userCertificates,
      userAvgScore,
      recentAttempts,
      userProfile
    ] = await Promise.all([
      // Total test attempts
      db.testAttempt.count({
        where: { 
          userId,
          completedAt: { not: null }
        }
      }),
      
      // Total certificates earned
      db.certificate.count({
        where: { userId, isValid: true }
      }),
      
      // Average score
      db.testAttempt.aggregate({
        where: { 
          userId,
          completedAt: { not: null }
        },
        _avg: { score: true }
      }),
      
      // Recent test attempts (last 5)
      db.testAttempt.findMany({
        where: { 
          userId,
          completedAt: { not: null }
        },
        include: {
          test: {
            select: {
              title: true,
              category: {
                select: { name: true }
              }
            }
          }
        },
        orderBy: { completedAt: 'desc' },
        take: 5
      }),

      // User profile info
      db.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          email: true,
          createdAt: true,
          role: true
        }
      })
    ]);

    // Calculate current level based on tests completed
    let currentLevel = "Beginner";
    if (userAttempts >= 10) {currentLevel = "Intermediate";}
    if (userAttempts >= 25) {currentLevel = "Advanced";}
    if (userAttempts >= 50) {currentLevel = "Expert";}

    // Calculate study streak (consecutive days with activity)
    const studyStreak = await calculateStudyStreak(userId);

    const stats = {
      user: userProfile,
      overview: {
        testsCompleted: userAttempts,
        certificatesEarned: userCertificates,
        averageScore: Math.round(userAvgScore._avg.score || 0),
        currentLevel,
        studyStreak
      },
      recentActivity: recentAttempts.map(attempt => ({
        id: attempt.id,
        testTitle: attempt.test.title,
        category: attempt.test.category.name,
        score: Math.round(attempt.score),
        passed: attempt.passed,
        completedAt: attempt.completedAt,
        timeSpent: attempt.completedAt && attempt.startedAt 
          ? Math.round((new Date(attempt.completedAt).getTime() - new Date(attempt.startedAt).getTime()) / (1000 * 60))
          : null
      }))
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}

async function calculateStudyStreak(userId: string): Promise<number> {
  try {
    // Get all test attempts ordered by date
    const attempts = await db.testAttempt.findMany({
      where: { 
        userId,
        completedAt: { not: null }
      },
      select: { completedAt: true },
      orderBy: { completedAt: 'desc' }
    });

    if (attempts.length === 0) {return 0;}

    let streak = 0;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Group attempts by date
    const attemptsByDate = new Map<string, boolean>();
    attempts.forEach(attempt => {
      if (attempt.completedAt) {
        const date = new Date(attempt.completedAt);
        date.setHours(0, 0, 0, 0);
        attemptsByDate.set(date.toISOString(), true);
      }
    });

    // Calculate consecutive days
    while (true) {
      const dateStr = currentDate.toISOString();
      if (attemptsByDate.has(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error("Study streak calculation error:", error);
    return 0;
  }
}