"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  BookOpen,
  Clock,
  Award,
  Play,
  Search,
  Filter,
  Star,
  TrendingUp,
  Calendar,
  Users,
  ChevronDown,
  BookmarkPlus,
  RotateCcw,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface TestData {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryType: string;
  difficulty: string;
  level: string;
  duration: number;
  totalQuestions: number;
  totalAttempts: number;
  passingScore: number;
  creator: string;
  userProgress: {
    attempts: number;
    bestScore: number | null;
    latestScore: number | null;
    passed: boolean;
    inProgress: boolean;
    lastAttemptDate: string | null;
  };
}

interface TestsResponse {
  tests: TestData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  recommended: any[];
  popular: any[];
}

export function DashboardTestsView() {
  const [testsData, setTestsData] = useState<TestsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "All Categories",
    "Programming",
    "Web Development", 
    "Data Science",
    "Cybersecurity",
    "Cloud Computing",
    "DevOps"
  ];

  const difficulties = ["All Levels", "BEGINNER", "INTERMEDIATE", "ADVANCED"];
  const statuses = [
    { value: "all", label: "All Tests" },
    { value: "available", label: "Available" },
    { value: "completed", label: "Completed" },
    { value: "in-progress", label: "In Progress" }
  ];

  useEffect(() => {
    fetchTests();
  }, [currentPage, searchQuery, selectedCategory, selectedDifficulty, selectedStatus]);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        search: searchQuery,
        category: selectedCategory === "All Categories" ? "" : selectedCategory,
        difficulty: selectedDifficulty === "All Levels" ? "" : selectedDifficulty,
        status: selectedStatus
      });

      const response = await fetch(`/api/dashboard/tests?${params}`);
      if (!response.ok) {throw new Error('Failed to fetch tests');}
      
      const data = await response.json();
      setTestsData(data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (test: TestData) => {
    if (test.userProgress.inProgress) {
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
    if (test.userProgress.passed) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    if (test.userProgress.attempts > 0) {
      return <RotateCcw className="h-4 w-4 text-blue-600" />;
    }
    return <Play className="h-4 w-4 text-gray-600" />;
  };

  const getStatusText = (test: TestData) => {
    if (test.userProgress.inProgress) {return "In Progress";}
    if (test.userProgress.passed) {return "Completed";}
    if (test.userProgress.attempts > 0) {return "Retry Available";}
    return "Start Test";
  };

  if (loading && !testsData) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Test Management</h1>
          <p className="text-muted-foreground">
            Discover tests, track your progress, and continue learning
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Bookmarked
          </Button>
          <Button size="sm" asChild>
            <Link href="/tests">
              <Play className="h-4 w-4 mr-2" />
              Browse All Tests
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tests by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            
            {/* Filter Toggle */}
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background text-sm"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background text-sm"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Recommended Tests */}
      {testsData?.recommended && testsData.recommended.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span>Recommended for You</span>
            </CardTitle>
            <CardDescription>Based on your learning progress and interests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testsData.recommended.slice(0, 3).map((test: any) => (
                <div key={test.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <h4 className="font-medium mb-2">{test.title}</h4>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span>{test.category.name}</span>
                    <Badge className={getDifficultyColor(test.difficulty)}>
                      {test.difficulty.toLowerCase()}
                    </Badge>
                  </div>
                  <Button size="sm" className="w-full" asChild>
                    <Link href={`/tests/${test.id}`}>Start Test</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testsData?.tests.map((test) => (
          <Card key={test.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{test.title}</CardTitle>
                  <CardDescription className="mt-1">{test.category}</CardDescription>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  {getStatusIcon(test)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {test.description}
              </p>

              {/* Test Metadata */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {test.duration} min
                </div>
                <div className="flex items-center text-muted-foreground">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {test.totalQuestions} questions
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  {test.totalAttempts} attempts
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Award className="h-4 w-4 mr-1" />
                  {test.passingScore}% to pass
                </div>
              </div>

              {/* Difficulty and Level */}
              <div className="flex items-center justify-between">
                <Badge className={getDifficultyColor(test.difficulty)}>
                  {test.difficulty.toLowerCase()}
                </Badge>
                {test.level && (
                  <Badge variant="secondary">{test.level}</Badge>
                )}
              </div>

              {/* User Progress */}
              {test.userProgress.attempts > 0 && (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Your Progress</span>
                    <span className="font-medium">{test.userProgress.attempts} attempts</span>
                  </div>
                  {test.userProgress.bestScore !== null && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Best Score</span>
                      <span className={`font-medium ${
                        test.userProgress.passed ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {test.userProgress.bestScore}%
                      </span>
                    </div>
                  )}
                  {test.userProgress.lastAttemptDate && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      Last attempt: {new Date(test.userProgress.lastAttemptDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <Button 
                className="w-full" 
                variant={test.userProgress.passed ? "outline" : "default"}
                asChild
              >
                <Link href={`/tests/${test.id}`}>
                  {getStatusIcon(test)}
                  <span className="ml-2">{getStatusText(test)}</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {testsData?.pagination && testsData.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((testsData.pagination.currentPage - 1) * 12) + 1} to{" "}
            {Math.min(testsData.pagination.currentPage * 12, testsData.pagination.totalCount)} of{" "}
            {testsData.pagination.totalCount} tests
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!testsData.pagination.hasPrev}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!testsData.pagination.hasNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {testsData?.tests.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No tests found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search criteria or browse all available tests.
          </p>
          <Button asChild>
            <Link href="/tests">Browse All Tests</Link>
          </Button>
        </div>
      )}
    </div>
  );
}