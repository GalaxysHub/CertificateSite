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
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <IconComponent 
                  className="w-6 h-6"
                  style={{ color: category.color }}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
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
          <Button asChild className="w-full hover:ring-1 hover:ring-blue-300 hover:ring-offset-1 transition-all duration-200">
            <Link href={`/tests/category/${category.id}`}>
              Explore Tests
            </Link>
          </Button>
        </div>
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

// Language learning categories
export const sampleCategories: TestCategory[] = [
  {
    id: 'english',
    name: 'English Language',
    description: 'Master English with CEFR-aligned proficiency tests from A1 to C2 levels. Perfect for academic and professional advancement.',
    icon: 'globe',
    testCount: 12,
    difficulty: 'intermediate',
    duration: '60-90 min',
    price: 0,
    featured: true,
    color: '#3B82F6',
  },
  {
    id: 'spanish',
    name: 'Spanish Language',
    description: 'Evaluate your Spanish proficiency with comprehensive tests following CEFR standards. ¡Perfecto para hispanohablantes!',
    icon: 'globe',
    testCount: 8,
    difficulty: 'beginner',
    duration: '60-75 min',
    price: 0,
    featured: true,
    color: '#EF4444',
  },
  {
    id: 'french',
    name: 'French Language',
    description: 'Test your French language skills with CECRL-based assessments. Parfait pour améliorer votre niveau.',
    icon: 'globe',
    testCount: 6,
    difficulty: 'beginner',
    duration: '60-75 min',
    price: 0,
    featured: true,
    color: '#6366F1',
  },
  {
    id: 'german',
    name: 'German Language',
    description: 'Assess your German proficiency with GER-standard tests. Perfekt für Deutschlerner aller Niveaus.',
    icon: 'globe',
    testCount: 5,
    difficulty: 'beginner',
    duration: '60-75 min',
    price: 0,
    featured: false,
    color: '#F59E0B',
  },
  {
    id: 'italian',
    name: 'Italian Language',
    description: 'Evaluate your Italian skills with QCER-aligned proficiency tests. Perfetto per gli amanti della lingua italiana.',
    icon: 'globe',
    testCount: 4,
    difficulty: 'beginner',
    duration: '60-75 min',
    price: 0,
    featured: false,
    color: '#10B981',
  },
  {
    id: 'portuguese',
    name: 'Portuguese Language',
    description: 'Test your Portuguese proficiency with comprehensive CEFR-based assessments for Brazilian and European Portuguese.',
    icon: 'globe',
    testCount: 3,
    difficulty: 'beginner',
    duration: '60-75 min',
    price: 0,
    featured: false,
    color: '#84CC16',
  },
  {
    id: 'chinese',
    name: 'Chinese Language',
    description: 'Master Mandarin Chinese with HSK-based proficiency tests. Perfect for business and cultural communication.',
    icon: 'globe',
    testCount: 6,
    difficulty: 'advanced',
    duration: '75-90 min',
    price: 0,
    featured: true,
    color: '#DC2626',
  },
  {
    id: 'japanese',
    name: 'Japanese Language',
    description: 'Assess your Japanese skills with JLPT-aligned tests covering hiragana, katakana, kanji, and grammar.',
    icon: 'globe',
    testCount: 5,
    difficulty: 'advanced',
    duration: '75-90 min',
    price: 0,
    featured: false,
    color: '#EC4899',
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
            Choose Your Language
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master languages with internationally recognized proficiency tests following CEFR, HSK, and JLPT standards
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