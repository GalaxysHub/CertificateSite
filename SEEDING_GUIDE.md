# Database Seeding Guide

This guide explains how to seed your certificate testing platform database with comprehensive test data.

## Overview

The seeding process will create:
- **12 Test Categories** across 4 types (Language, Professional, Technical, Academic)
- **5 Complete Tests** with 25 questions each
- **125 Sample Questions** with explanations
- **1 Admin User** for testing
- **Realistic Test Data** similar to platforms like Testizer

## Test Categories Created

### Language Tests (CEFR Standards)
- English Language (A1-C2 levels)
- Spanish Language (A1-C2 levels)
- French Language (A1-C2 levels)
- German Language (A1-C2 levels)
- Chinese Language (HSK levels)

### Professional Skills
- Adobe Creative Suite (Photoshop, Illustrator, etc.)
- Digital Marketing (Google Ads, Analytics, etc.)
- Business Management (Sales, Customer Service, etc.)

### Technical Skills
- Computer Skills (Basic to Advanced IT)
- Programming (Fundamentals to Advanced)

### Academic Subjects
- Mathematics (Algebra, Geometry, Calculus)
- Science (General Science, Physics, Chemistry)

## Sample Tests Included

### 1. English A1 - Basic User
- **Duration**: 45 minutes
- **Questions**: 25 multiple choice
- **Passing Score**: 60%
- **Level**: CEFR A1
- **Topics**: Basic grammar, vocabulary, simple communication

### 2. English B2 - Independent User
- **Duration**: 90 minutes
- **Questions**: 25 multiple choice
- **Passing Score**: 70%
- **Level**: CEFR B2
- **Topics**: Complex grammar, advanced vocabulary, idioms

### 3. Adobe Photoshop Certified User
- **Duration**: 75 minutes
- **Questions**: 25 multiple choice
- **Passing Score**: 75%
- **Topics**: Tools, layers, color correction, workflow

### 4. Programming Fundamentals
- **Duration**: 60 minutes
- **Questions**: 25 multiple choice
- **Passing Score**: 65%
- **Topics**: Variables, loops, functions, debugging

### 5. General Mathematics Assessment
- **Duration**: 90 minutes
- **Questions**: 25 multiple choice
- **Passing Score**: 70%
- **Topics**: Algebra, geometry, statistics, calculus

## How to Seed the Database

### Prerequisites
1. Database is set up and running
2. Prisma is configured with correct DATABASE_URL
3. Node.js and npm/yarn are installed

### Steps

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Generate Prisma client**:
   ```bash
   npm run db:generate
   ```

3. **Run database migrations**:
   ```bash
   npm run db:migrate
   ```

4. **Seed the database**:
   ```bash
   npm run db:seed
   ```

### Expected Output
```
🌱 Starting database seeding...
👤 Creating admin user...
📚 Creating test categories...
📝 Creating English language tests...
🎨 Creating Adobe Photoshop test...
💻 Creating Programming fundamentals test...
🔢 Creating Mathematics test...
✅ Database seeding completed successfully!
📊 Created 12 test categories
📝 Created 5 comprehensive tests with sample questions
👤 Admin user: admin@example.com
```

## Admin User Created

- **Email**: admin@example.com
- **Password**: admin123
- **Role**: ADMIN
- **Purpose**: For testing and managing the platform

⚠️ **Important**: Change the admin password after seeding in production!

## Test Data Features

### Realistic Content
- Questions modeled after real certification exams
- Proper difficulty progression
- Educational explanations for each answer
- Industry-standard topics and scenarios

### CEFR Compliance
- Language tests follow Common European Framework standards
- Appropriate vocabulary and grammar for each level
- Realistic scenarios for language use

### Professional Relevance
- Adobe Photoshop questions cover real-world tasks
- Programming questions teach fundamental concepts
- Mathematics covers academic curriculum standards

### Comprehensive Coverage
- 25 questions per test (industry standard)
- Multiple difficulty levels
- Various question types and topics
- Proper scoring and passing thresholds

## Utility Functions Available

The platform includes utility functions in `/src/lib/test-utils.ts`:

### Question Management
- `randomizeQuestions()` - Shuffles question order
- `randomizeQuestionOptions()` - Shuffles answer options
- `createTestSession()` - Creates randomized test session

### Scoring & Results
- `calculateTestResults()` - Calculates scores and statistics
- `determineProficiencyLevel()` - Determines CEFR/skill level
- `validateTestAnswers()` - Validates answer format

### Time Management
- `calculateRemainingTime()` - Tracks test time limits
- `isTestSessionExpired()` - Checks if test expired
- `formatDuration()` - Human-readable time format

### Analytics
- `calculateTestStatistics()` - Comprehensive test analytics
- `formatTestResults()` - Formatted result display

## Database Schema Updates

### New Models
- `TestCategory` - Organizes tests by type and subject
- Enhanced `Test` model with level, passing score, total questions

### New Enums
- `TestCategoryType` - LANGUAGE, PROFESSIONAL, TECHNICAL, ACADEMIC

### Enhanced Features
- CEFR level support for language tests
- Configurable passing scores per test
- Better relationship structure

## Next Steps

After seeding:

1. **Test the Data**: Access tests through your application
2. **Create More Tests**: Use the seeded data as templates
3. **Customize Content**: Modify questions for your specific needs
4. **Add More Languages**: Extend language tests to other languages
5. **Professional Certifications**: Add more Adobe, Microsoft, Google certifications

## Expanding the Data

To add more test data:

1. **Edit `/prisma/seed.ts`**
2. **Add new question arrays**
3. **Create new test categories**
4. **Run seeding again**

Example for adding Spanish A1:
```typescript
const spanishA1Questions = [
  {
    question: "¿Cómo te llamas?",
    options: ['Me llamo Juan', 'Tengo 20 años', 'Vivo en Madrid', 'Soy estudiante'],
    correctAnswer: 'Me llamo Juan',
    explanation: "La pregunta '¿Cómo te llamas?' se responde con 'Me llamo...'",
    points: 1,
  },
  // ... more questions
];
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL in .env
   - Ensure database is running

2. **Migration Issues**
   - Run `npm run db:push` to sync schema
   - Check for conflicts with existing data

3. **Seeding Fails**
   - Clear existing data if needed
   - Check for unique constraint violations

### Clean Restart
```bash
# Reset database (caution: deletes all data)
npx prisma migrate reset
npm run db:seed
```

## Support

For questions or issues:
1. Check the console output for specific errors
2. Verify database connection
3. Ensure all dependencies are installed
4. Review Prisma schema for conflicts

The seeded data provides a solid foundation for your certificate testing platform with realistic, educational content across multiple domains and difficulty levels.