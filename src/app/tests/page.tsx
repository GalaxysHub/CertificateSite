'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Clock, 
  Star,
  Users,
  ArrowRight,
  Grid,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestCategoryGrid, sampleCategories } from '@/components/ui/test-category-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Sample test data - in a real app this would come from an API
const sampleTests = [
  {
    id: 1,
    title: 'JavaScript Fundamentals Certification',
    description: 'Master the fundamentals of JavaScript programming including ES6+ features, DOM manipulation, and async programming.',
    category: 'Programming',
    difficulty: 'beginner' as const,
    duration: '45 minutes',
    price: 0,
    rating: 4.8,
    enrolledCount: 2341,
    featured: true,
    skills: ['JavaScript', 'ES6+', 'DOM', 'Async/Await'],
    instructor: 'Sarah Chen',
    lastUpdated: '2024-01-15'
  },
  {
    id: 2,
    title: 'Digital Marketing Analytics',
    description: 'Learn to analyze marketing campaigns, interpret data, and make data-driven decisions for marketing success.',
    category: 'Marketing',
    difficulty: 'intermediate' as const,
    duration: '90 minutes',
    price: 49,
    rating: 4.9,
    enrolledCount: 1876,
    featured: true,
    skills: ['Google Analytics', 'Data Analysis', 'ROI', 'KPIs'],
    instructor: 'Michael Rodriguez',
    lastUpdated: '2024-01-20'
  },
  {
    id: 3,
    title: 'UI/UX Design Principles',
    description: 'Comprehensive course covering user interface and user experience design principles, tools, and best practices.',
    category: 'Design',
    difficulty: 'intermediate' as const,
    duration: '120 minutes',
    price: 79,
    rating: 4.7,
    enrolledCount: 1523,
    featured: false,
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    instructor: 'Emily Watson',
    lastUpdated: '2024-01-18'
  },
  {
    id: 4,
    title: 'Project Management Essentials',
    description: 'Learn fundamental project management skills including planning, execution, monitoring, and team leadership.',
    category: 'Business',
    difficulty: 'beginner' as const,
    duration: '60 minutes',
    price: 39,
    rating: 4.6,
    enrolledCount: 3124,
    featured: false,
    skills: ['Agile', 'Scrum', 'Risk Management', 'Leadership'],
    instructor: 'David Kim',
    lastUpdated: '2024-01-22'
  },
  {
    id: 5,
    title: 'Cybersecurity Fundamentals',
    description: 'Essential cybersecurity concepts, threat analysis, and security best practices for IT professionals.',
    category: 'Technology',
    difficulty: 'advanced' as const,
    duration: '150 minutes',
    price: 99,
    rating: 4.8,
    enrolledCount: 987,
    featured: true,
    skills: ['Network Security', 'Threat Analysis', 'Encryption', 'Compliance'],
    instructor: 'Alex Thompson',
    lastUpdated: '2024-01-25'
  },
  {
    id: 6,
    title: 'Financial Planning & Analysis',
    description: 'Master financial planning, budgeting, forecasting, and analytical skills for finance professionals.',
    category: 'Finance',
    difficulty: 'advanced' as const,
    duration: '180 minutes',
    price: 129,
    rating: 4.7,
    enrolledCount: 756,
    featured: false,
    skills: ['Financial Modeling', 'Budgeting', 'Forecasting', 'Excel'],
    instructor: 'Jennifer Lee',
    lastUpdated: '2024-01-19'
  }
];

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

export default function TestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['All', ...Array.from(new Set(sampleTests.map(test => test.category)))];
  const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];
  const priceRanges = ['All', 'Free', 'Paid'];

  const filteredAndSortedTests = useMemo(() => {
    const filtered = sampleTests.filter(test => {
      const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           test.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || test.difficulty === selectedDifficulty;
      const matchesPrice = selectedPrice === 'All' || 
                          (selectedPrice === 'Free' && test.price === 0) ||
                          (selectedPrice === 'Paid' && test.price > 0);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesPrice;
    });

    // Sort tests
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'rating':
          return b.rating - a.rating;
        case 'enrolled':
          return b.enrolledCount - a.enrolledCount;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedPrice, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Certification Tests
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from hundreds of professional certification tests to validate your skills 
              and advance your career
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for tests, skills, or topics..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Category: {selectedCategory}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categories.map(category => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Difficulty: {selectedDifficulty}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Difficulty</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {difficulties.map(difficulty => (
                    <DropdownMenuItem
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                    >
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Price: {selectedPrice}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Price Range</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {priceRanges.map(price => (
                    <DropdownMenuItem
                      key={price}
                      onClick={() => setSelectedPrice(price)}
                    >
                      {price}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Sort by: {sortBy.replace('-', ' ')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy('featured')}>Featured</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('rating')}>Highest Rated</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('enrolled')}>Most Popular</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('price-low')}>Price: Low to High</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('price-high')}>Price: High to Low</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('newest')}>Newest</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>{filteredAndSortedTests.length} tests found</span>
          </div>
        </div>
      </section>

      {/* Test Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {filteredAndSortedTests.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setSelectedPrice('All');
              }}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <motion.div
              className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={viewMode}
            >
              {filteredAndSortedTests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {viewMode === 'grid' ? (
                    <TestCard test={test} />
                  ) : (
                    <TestListItem test={test} />
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive range of certification categories
            </p>
          </motion.div>

          <TestCategoryGrid categories={sampleCategories} />
        </div>
      </section>
    </div>
  );
}

interface TestCardProps {
  test: typeof sampleTests[0];
}

function TestCard({ test }: TestCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge 
            variant="secondary" 
            className={`${difficultyColors[test.difficulty]} text-xs`}
          >
            {test.difficulty}
          </Badge>
          {test.featured && (
            <Badge className="bg-blue-600 text-white text-xs">
              Featured
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
          {test.title}
        </CardTitle>
        <p className="text-sm text-gray-600 line-clamp-2">
          {test.description}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {test.duration}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {test.enrolledCount.toLocaleString()}
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
            {test.rating}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {test.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {test.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{test.skills.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            by {test.instructor}
          </div>
          <div className="text-right">
            {test.price === 0 ? (
              <span className="text-lg font-semibold text-green-600">Free</span>
            ) : (
              <span className="text-lg font-semibold text-gray-900">
                ${test.price}
              </span>
            )}
          </div>
        </div>

        <Button className="w-full mt-4 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-200 ease-in-out" asChild>
          <Link href={`/tests/${test.id}`}>
            Start Test
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function TestListItem({ test }: TestCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="secondary" 
                className={`${difficultyColors[test.difficulty]} text-xs`}
              >
                {test.difficulty}
              </Badge>
              {test.featured && (
                <Badge className="bg-blue-600 text-white text-xs">
                  Featured
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {test.category}
              </Badge>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
              {test.title}
            </h3>
            
            <p className="text-gray-600 mb-3 line-clamp-2">
              {test.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {test.duration}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {test.enrolledCount.toLocaleString()} enrolled
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                {test.rating}
              </div>
              <span>by {test.instructor}</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {test.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col items-end space-y-3">
            <div className="text-right">
              {test.price === 0 ? (
                <span className="text-xl font-semibold text-green-600">Free</span>
              ) : (
                <span className="text-xl font-semibold text-gray-900">
                  ${test.price}
                </span>
              )}
            </div>
            
            <Button asChild>
              <Link href={`/tests/${test.id}`}>
                Start Test
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}