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
    const timeRange = searchParams.get('range') || '30'; // days

    const daysAgo = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Get performance trends
    const performanceData = await db.testAttempt.findMany({
      where: {
        userId,
        completedAt: {
          gte: startDate,
          not: null
        }
      },
      select: {
        score: true,
        completedAt: true,
        test: {
          select: {
            title: true,
            category: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { completedAt: 'asc' }
    });

    // Group by week for trend analysis
    const weeklyPerformance = groupByWeek(performanceData);

    // Get performance by category
    const categoryPerformance = await db.testAttempt.findMany({
      where: {
        userId,
        completedAt: { not: null }
      },
      include: {
        test: {
          select: {
            category: {
              select: { name: true, type: true }
            }
          }
        }
      }
    });

    const categoryStats = groupByCategory(categoryPerformance);

    // Get skill progression (difficulty levels over time)
    const skillProgression = await db.testAttempt.findMany({
      where: {
        userId,
        completedAt: { not: null }
      },
      include: {
        test: {
          select: {
            difficulty: true,
            title: true
          }
        }
      },
      orderBy: { completedAt: 'asc' }
    });

    const progressionData = analyzeSkillProgression(skillProgression);

    // Get goal progress (if we had goals system)
    const goals = {
      monthly: {
        target: 5,
        current: performanceData.filter(p => {
          const testDate = new Date(p.completedAt!);
          const now = new Date();
          return testDate.getMonth() === now.getMonth() && 
                 testDate.getFullYear() === now.getFullYear();
        }).length
      },
      averageScore: {
        target: 85,
        current: Math.round(performanceData.reduce((acc, p) => acc + p.score, 0) / performanceData.length) || 0
      }
    };

    const analytics = {
      performanceTrends: weeklyPerformance,
      categoryPerformance: categoryStats,
      skillProgression: progressionData,
      goals
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}

function groupByWeek(attempts: any[]) {
  const weeks = new Map<string, { scores: number[], count: number }>();
  
  attempts.forEach(attempt => {
    if (!attempt.completedAt) {return;}
    
    const date = new Date(attempt.completedAt);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeks.has(weekKey)) {
      weeks.set(weekKey, { scores: [], count: 0 });
    }
    
    const week = weeks.get(weekKey)!;
    week.scores.push(attempt.score);
    week.count++;
  });
  
  return Array.from(weeks.entries()).map(([week, data]) => ({
    week,
    averageScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
    testCount: data.count
  })).sort((a, b) => a.week.localeCompare(b.week));
}

function groupByCategory(attempts: any[]) {
  const categories = new Map<string, { scores: number[], count: number, passed: number }>();
  
  attempts.forEach(attempt => {
    const categoryName = attempt.test.category.name;
    
    if (!categories.has(categoryName)) {
      categories.set(categoryName, { scores: [], count: 0, passed: 0 });
    }
    
    const category = categories.get(categoryName)!;
    category.scores.push(attempt.score);
    category.count++;
    if (attempt.passed) {category.passed++;}
  });
  
  return Array.from(categories.entries()).map(([name, data]) => ({
    category: name,
    averageScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
    totalTests: data.count,
    passedTests: data.passed,
    passRate: Math.round((data.passed / data.count) * 100)
  }));
}

function analyzeSkillProgression(attempts: any[]) {
  const difficultyOrder = { 'BEGINNER': 1, 'INTERMEDIATE': 2, 'ADVANCED': 3 };
  
  return attempts.map(attempt => ({
    date: attempt.completedAt,
    difficulty: attempt.test.difficulty,
    difficultyLevel: difficultyOrder[attempt.test.difficulty as keyof typeof difficultyOrder],
    score: attempt.score,
    testTitle: attempt.test.title,
    passed: attempt.passed
  }));
}