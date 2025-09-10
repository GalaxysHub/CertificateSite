"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  Clock,
  Award,
  BookOpen,
  Calendar,
  Users,
  ArrowUp,
  ArrowDown,
  Minus,
  Download,
  Share
} from "lucide-react";

interface AnalyticsData {
  performanceTrends: Array<{
    week: string;
    averageScore: number;
    testCount: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    averageScore: number;
    totalTests: number;
    passedTests: number;
    passRate: number;
  }>;
  skillProgression: Array<{
    date: string;
    difficulty: string;
    difficultyLevel: number;
    score: number;
    testTitle: string;
    passed: boolean;
  }>;
  goals: {
    monthly: {
      target: number;
      current: number;
    };
    averageScore: {
      target: number;
      current: number;
    };
  };
}

export function DashboardAnalyticsView() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");

  const timeRanges = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 3 months" },
    { value: "365", label: "Last year" }
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/dashboard/analytics?range=${timeRange}`);
      if (!response.ok) {throw new Error('Failed to fetch analytics');}
      
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    if (!analytics) {return;}
    
    const data = JSON.stringify(analytics, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {return <ArrowUp className="h-4 w-4 text-green-600" />;}
    if (current < previous) {return <ArrowDown className="h-4 w-4 text-red-600" />;}
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) {return "text-green-600";}
    if (current < previous) {return "text-red-600";}
    return "text-gray-400";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const calculateGoalProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-8">
        <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">No analytics data available</h3>
        <p className="text-muted-foreground">Complete some tests to see your analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Learning Analytics</h1>
          <p className="text-muted-foreground">
            Track your progress and performance insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border border-input rounded-md bg-background text-sm"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Goal Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Monthly Goal</span>
            </CardTitle>
            <CardDescription>Tests completed this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-600">
                  {analytics.goals.monthly.current}
                </span>
                <span className="text-lg text-muted-foreground">
                  / {analytics.goals.monthly.target}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${calculateGoalProgress(analytics.goals.monthly.current, analytics.goals.monthly.target)}%`
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {analytics.goals.monthly.target - analytics.goals.monthly.current > 0
                  ? `${analytics.goals.monthly.target - analytics.goals.monthly.current} tests to go`
                  : "Goal achieved! 🎉"
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Average Score Goal</span>
            </CardTitle>
            <CardDescription>Target vs actual performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-green-600">
                  {analytics.goals.averageScore.current}%
                </span>
                <span className="text-lg text-muted-foreground">
                  / {analytics.goals.averageScore.target}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${calculateGoalProgress(analytics.goals.averageScore.current, analytics.goals.averageScore.target)}%`
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {analytics.goals.averageScore.current >= analytics.goals.averageScore.target
                  ? "Goal achieved! Keep it up! 🎉"
                  : `${analytics.goals.averageScore.target - analytics.goals.averageScore.current}% to target`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Performance Trends</span>
          </CardTitle>
          <CardDescription>Your weekly performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.performanceTrends.length > 0 ? (
            <div className="space-y-4">
              {/* Simple chart representation */}
              <div className="space-y-2">
                {analytics.performanceTrends.map((week, index) => {
                  const prevWeek = analytics.performanceTrends[index - 1];
                  const maxScore = Math.max(...analytics.performanceTrends.map(w => w.averageScore));
                  const barWidth = (week.averageScore / maxScore) * 100;
                  
                  return (
                    <div key={week.week} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Week of {new Date(week.week).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{week.averageScore}%</span>
                          {prevWeek && getTrendIcon(week.averageScore, prevWeek.averageScore)}
                          <Badge variant="secondary">{week.testCount} tests</Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No performance data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5" />
            <span>Performance by Category</span>
          </CardTitle>
          <CardDescription>How you perform in different subject areas</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.categoryPerformance.length > 0 ? (
            <div className="space-y-4">
              {analytics.categoryPerformance.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{category.category}</h4>
                      <p className="text-sm text-muted-foreground">
                        {category.totalTests} tests • {category.passedTests} passed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{category.averageScore}%</div>
                      <div className="text-sm text-muted-foreground">{category.passRate}% pass rate</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${category.averageScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <PieChart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No category data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skill Progression */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Skill Progression</span>
          </CardTitle>
          <CardDescription>Your journey through difficulty levels</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.skillProgression.length > 0 ? (
            <div className="space-y-4">
              <div className="relative">
                {/* Timeline */}
                <div className="space-y-6">
                  {analytics.skillProgression.slice(-10).map((attempt, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-4 h-4 relative">
                        <div className={`w-4 h-4 rounded-full ${getDifficultyColor(attempt.difficulty)}`} />
                        {index < analytics.skillProgression.length - 1 && (
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-px h-6 bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium truncate">{attempt.testTitle}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(attempt.date).toLocaleDateString()} • {attempt.difficulty}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${
                              attempt.passed ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {attempt.score}%
                            </div>
                            <Badge variant={attempt.passed ? "default" : "secondary"}>
                              {attempt.passed ? "Passed" : "Failed"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {analytics.skillProgression.length > 10 && (
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing latest 10 attempts of {analytics.skillProgression.length} total
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No progression data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}