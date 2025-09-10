"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  BookOpen,
  Award,
  TrendingUp,
  Target,
  Clock,
  Star,
  Trophy,
  Calendar,
  ArrowRight,
  Activity,
  Zap,
  Users,
  ChevronRight
} from "lucide-react";

interface DashboardStats {
  user: {
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
  overview: {
    testsCompleted: number;
    certificatesEarned: number;
    averageScore: number;
    currentLevel: string;
    studyStreak: number;
  };
  recentActivity: Array<{
    id: string;
    testTitle: string;
    category: string;
    score: number;
    passed: boolean;
    completedAt: string;
    timeSpent: number | null;
  }>;
}

export function DashboardOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={fetchDashboardStats}>Try Again</Button>
      </div>
    );
  }

  if (!stats) return null;

  const timeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'expert': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              Good {timeOfDay()}, {stats.user.name || 'there'}!
            </h1>
            <p className="text-primary-foreground/90 mb-4">
              Ready to continue your learning journey? You're doing great!
            </p>
            <div className="flex items-center space-x-4">
              <Badge className={`${getLevelColor(stats.overview.currentLevel)} text-sm font-medium`}>
                {stats.overview.currentLevel} Level
              </Badge>
              {stats.overview.studyStreak > 0 && (
                <div className="flex items-center space-x-1 text-primary-foreground/90">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">{stats.overview.studyStreak} day streak</span>
                </div>
              )}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tests Completed
            </CardTitle>
            <BookOpen className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {stats.overview.testsCompleted}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Keep up the momentum!
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Certificates Earned
            </CardTitle>
            <Award className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.overview.certificatesEarned}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <Star className="h-3 w-3 mr-1" />
              Your achievements
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
            <Target className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {stats.overview.averageScore}%
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.overview.averageScore >= 80 ? 'Excellent!' : 
               stats.overview.averageScore >= 70 ? 'Good work!' : 'Keep improving!'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Study Streak
            </CardTitle>
            <Zap className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {stats.overview.studyStreak}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {stats.overview.studyStreak > 0 ? 'days in a row' : 'Start today!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Your latest test completions</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/tests">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.testTitle}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {activity.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        activity.passed ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {activity.score}%
                      </div>
                      {activity.timeSpent && (
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.timeSpent}m
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No tests completed yet</p>
                  <p className="text-sm">Start your first test to see activity here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/tests" className="block">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors group">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Take a Test</p>
                      <p className="text-sm text-muted-foreground">Start a new assessment</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600" />
                </div>
              </Link>

              <Link href="/dashboard/certificates" className="block">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition-colors group">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">View Certificates</p>
                      <p className="text-sm text-muted-foreground">Your earned certificates</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-green-600" />
                </div>
              </Link>

              <Link href="/dashboard/analytics" className="block">
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors group">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">View Analytics</p>
                      <p className="text-sm text-muted-foreground">Track your progress</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-600" />
                </div>
              </Link>

              <Link href="/dashboard/profile" className="block">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-500 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Update Profile</p>
                      <p className="text-sm text-muted-foreground">Manage your account</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gray-600" />
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}