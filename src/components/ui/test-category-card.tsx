'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BookOpen, 
  Code, 
  Briefcase, 
  Heart, 
  Palette, 
  Calculator,
  Globe,
  Zap,
  Users,
  Shield,
  Cpu,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface TestCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  testCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  price: number;
  featured: boolean;
  color: string;
}

const iconMap = {
  'book-open': BookOpen,
  'code': Code,
  'briefcase': Briefcase,
  'heart': Heart,
  'palette': Palette,
  'calculator': Calculator,
  'globe': Globe,
  'zap': Zap,
  'users': Users,
  'shield': Shield,
  'cpu': Cpu,
  'trophy': Trophy,
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

interface TestCategoryCardProps {
  category: TestCategory;
  index?: number;
}

export function TestCategoryCard({ category, index = 0 }: TestCategoryCardProps) {
  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || BookOpen;
  
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
    >
      <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Featured Badge */}
        {category.featured && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="default" className="bg-blue-600 text-white">
              Popular
            </Badge>
          </div>
        )}

        {/* Color Bar */}
        <div 
          className="h-1 w-full"
          style={{ backgroundColor: category.color }}
        />

        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: `${category.color}20` }}
                whileHover={{ rotate: 5 }}
              >
                <IconComponent 
                  className="w-6 h-6"
                  style={{ color: category.color }}
                />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.testCount} tests available</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {category.description}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Badge 
                variant="secondary" 
                className={`text-xs ${difficultyColors[category.difficulty]}`}
              >
                {category.difficulty}
              </Badge>
              <span className="text-xs text-gray-500">{category.duration}</span>
            </div>
            <div className="text-right">
              {category.price === 0 ? (
                <span className="text-sm font-semibold text-green-600">Free</span>
              ) : (
                <span className="text-sm font-semibold text-gray-900">
                  ${category.price}
                </span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <Button asChild className="w-full group-hover:bg-primary-hover group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:-translate-y-0.5 transition-all duration-200 ease-in-out">
            <Link href={`/tests/category/${category.id}`}>
              Explore Tests
            </Link>
          </Button>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
}

interface TestCategoryGridProps {
  categories: TestCategory[];
  className?: string;
}

export function TestCategoryGrid({ categories, className = '' }: TestCategoryGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {categories.map((category, index) => (
        <TestCategoryCard key={category.id} category={category} index={index} />
      ))}
    </div>
  );
}

// Sample categories data
export const sampleCategories: TestCategory[] = [
  {
    id: 'programming',
    name: 'Programming',
    description: 'Test your coding skills in various programming languages including Python, JavaScript, Java, and more.',
    icon: 'code',
    testCount: 45,
    difficulty: 'intermediate',
    duration: '30-60 min',
    price: 0,
    featured: true,
    color: '#3B82F6',
  },
  {
    id: 'business',
    name: 'Business & Management',
    description: 'Assess your knowledge in business strategy, project management, and leadership skills.',
    icon: 'briefcase',
    testCount: 32,
    difficulty: 'advanced',
    duration: '45-90 min',
    price: 29,
    featured: false,
    color: '#10B981',
  },
  {
    id: 'design',
    name: 'Design & Creative',
    description: 'Evaluate your skills in UI/UX design, graphic design, and creative problem-solving.',
    icon: 'palette',
    testCount: 28,
    difficulty: 'beginner',
    duration: '20-45 min',
    price: 19,
    featured: true,
    color: '#F59E0B',
  },
  {
    id: 'marketing',
    name: 'Digital Marketing',
    description: 'Test your expertise in SEO, social media marketing, content marketing, and analytics.',
    icon: 'globe',
    testCount: 24,
    difficulty: 'intermediate',
    duration: '30-60 min',
    price: 25,
    featured: false,
    color: '#EF4444',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Assess medical knowledge, patient care, and healthcare administration skills.',
    icon: 'heart',
    testCount: 18,
    difficulty: 'advanced',
    duration: '60-120 min',
    price: 49,
    featured: false,
    color: '#EC4899',
  },
  {
    id: 'finance',
    name: 'Finance & Accounting',
    description: 'Test your knowledge in financial analysis, accounting principles, and investment strategies.',
    icon: 'calculator',
    testCount: 22,
    difficulty: 'intermediate',
    duration: '45-75 min',
    price: 35,
    featured: false,
    color: '#8B5CF6',
  },
  {
    id: 'technology',
    name: 'IT & Technology',
    description: 'Evaluate your skills in network administration, cybersecurity, and system architecture.',
    icon: 'cpu',
    testCount: 35,
    difficulty: 'advanced',
    duration: '60-90 min',
    price: 39,
    featured: true,
    color: '#06B6D4',
  },
  {
    id: 'education',
    name: 'Education & Training',
    description: 'Test your knowledge in pedagogy, curriculum development, and educational psychology.',
    icon: 'book-open',
    testCount: 15,
    difficulty: 'intermediate',
    duration: '30-60 min',
    price: 0,
    featured: false,
    color: '#84CC16',
  },
];

interface FeaturedCategoriesProps {
  limit?: number;
  showAll?: boolean;
}

export function FeaturedCategories({ limit = 6, showAll = false }: FeaturedCategoriesProps) {
  const displayCategories = showAll 
    ? sampleCategories 
    : sampleCategories.slice(0, limit);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Path
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select from our comprehensive range of certification tests designed by industry experts
          </p>
        </motion.div>

        <TestCategoryGrid categories={displayCategories} />

        {!showAll && sampleCategories.length > limit && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Button variant="outline" size="lg" asChild>
              <Link href="/tests">
                View All Categories
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}