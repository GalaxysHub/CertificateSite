import { User, Test, Question, TestAttempt, Certificate } from "@prisma/client";

export type UserRole = "USER" | "ADMIN" | "INSTRUCTOR";
export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "SHORT_ANSWER"
  | "ESSAY";

export interface ExtendedUser extends User {
  tests?: Test[];
  attempts?: TestAttempt[];
  certificates?: Certificate[];
}

export interface ExtendedTest extends Test {
  questions?: Question[];
  attempts?: TestAttempt[];
  creator?: User;
  _count?: {
    questions: number;
    attempts: number;
  };
}

export interface ExtendedQuestion extends Question {
  test?: Test;
}

export interface ExtendedTestAttempt extends TestAttempt {
  test?: Test;
  user?: User;
}

export interface ExtendedCertificate extends Certificate {
  user?: User;
}

export interface QuestionOptions {
  A: string;
  B: string;
  C?: string;
  D?: string;
}

export interface TestAttemptAnswer {
  questionId: string;
  answer: string;
  isCorrect?: boolean;
}

export interface CertificateData {
  recipientName: string;
  courseName: string;
  completionDate: string;
  score: number;
  proficiencyLevel?: string;
  instructorName: string;
  organizationName: string;
  testDuration?: number;
  totalQuestions?: number;
  passingScore?: number;
  additionalInfo?: Record<string, any>;
}

export type CertificateTemplate = 
  | "STANDARD"
  | "PROFESSIONAL" 
  | "ACADEMIC"
  | "TECHNICAL"
  | "LANGUAGE_PROFICIENCY";

export type CertificateAction =
  | "GENERATED"
  | "VIEWED"
  | "DOWNLOADED"
  | "EMAILED"
  | "VERIFIED"
  | "REVOKED"
  | "RESTORED";

export interface CertificateGenerationRequest {
  testAttemptId: string;
  templateType?: CertificateTemplate;
  recipientName?: string;
  customData?: Record<string, any>;
}

export interface CertificateVerificationData {
  verificationCode: string;
  isValid: boolean;
  certificateData?: {
    recipientName: string;
    testName: string;
    issueDate: string;
    score?: number;
    proficiencyLevel?: string;
    organizationName: string;
  };
  error?: string;
}

export interface CreateTestData {
  title: string;
  description?: string;
  category: string;
  difficulty: Difficulty;
  duration: number;
  questions: CreateQuestionData[];
}

export interface CreateQuestionData {
  question: string;
  type: QuestionType;
  options?: QuestionOptions;
  correctAnswer: string;
  explanation?: string;
  points: number;
}

export interface TestStats {
  totalTests: number;
  totalAttempts: number;
  totalCertificates: number;
  averageScore: number;
}

export interface UserStats {
  testsCompleted: number;
  certificatesEarned: number;
  averageScore: number;
  totalTimeSpent: number;
}

// Authentication related types
export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthError {
  type: string;
  message: string;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: UserRole;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}
