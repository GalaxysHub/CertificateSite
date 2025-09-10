import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { db } from './db';
import { CertificateTemplate, CertificateAction } from '@/types';

/**
 * Generate a unique verification code for a certificate
 */
export function generateVerificationCode(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `CERT-${timestamp}-${random}`.toUpperCase();
}

/**
 * Generate QR code data URL for certificate verification
 */
export async function generateQRCode(verificationCode: string, baseUrl?: string): Promise<string> {
  const verificationUrl = baseUrl 
    ? `${baseUrl}/verify-certificate?code=${verificationCode}`
    : `${process.env.NEXTAUTH_URL || 'https://localhost:3000'}/verify-certificate?code=${verificationCode}`;
  
  try {
    const qrCodeDataURL = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 200,
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Determine proficiency level based on score and test type
 */
export function calculateProficiencyLevel(
  score: number, 
  testType: string, 
  level?: string
): string {
  if (level) {
    // If test already has a specific level (like CEFR), use that
    return level;
  }

  // Default scoring system
  if (score >= 90) {return 'Advanced';}
  if (score >= 75) {return 'Intermediate';}
  if (score >= 60) {return 'Beginner';}
  return 'Foundation';
}

/**
 * Get certificate template based on test category and type
 */
export function getCertificateTemplate(
  testCategoryType: string,
  customTemplate?: CertificateTemplate
): CertificateTemplate {
  if (customTemplate) {return customTemplate;}

  switch (testCategoryType) {
    case 'LANGUAGE':
      return 'LANGUAGE_PROFICIENCY';
    case 'ACADEMIC':
      return 'ACADEMIC';
    case 'TECHNICAL':
      return 'TECHNICAL';
    case 'PROFESSIONAL':
      return 'PROFESSIONAL';
    default:
      return 'STANDARD';
  }
}

/**
 * Log certificate action for audit trail
 */
export async function logCertificateAction(
  certificateId: string,
  action: CertificateAction,
  performedBy?: string,
  ipAddress?: string,
  userAgent?: string,
  details?: any
) {
  try {
    await db.certificateAuditLog.create({
      data: {
        certificateId,
        action,
        performedBy,
        ipAddress,
        userAgent,
        details,
      },
    });
  } catch (error) {
    console.error('Error logging certificate action:', error);
    // Don't throw - audit logging shouldn't break certificate operations
  }
}

/**
 * Validate certificate verification code format
 */
export function isValidVerificationCodeFormat(code: string): boolean {
  const pattern = /^CERT-[A-Z0-9]+-[A-Z0-9]+$/;
  return pattern.test(code);
}

/**
 * Check if certificate has expired
 */
export function isCertificateExpired(expiryDate: Date | null): boolean {
  if (!expiryDate) {return false;}
  return new Date() > expiryDate;
}

/**
 * Generate file path for certificate storage
 */
export function generateCertificateFilePath(
  userId: string,
  certificateId: string,
  format: string = 'pdf'
): string {
  const date = new Date().toISOString().split('T')[0];
  return `certificates/${userId}/${date}/${certificateId}.${format}`;
}

/**
 * Sanitize certificate data for secure storage
 */
export function sanitizeCertificateData(data: any): any {
  // Remove any potentially sensitive information
  const sanitized = { ...data };
  delete sanitized.password;
  delete sanitized.token;
  delete sanitized.secret;
  
  return sanitized;
}

/**
 * Format certificate issue date
 */
export function formatCertificateDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Generate certificate title based on test and result
 */
export function generateCertificateTitle(
  testTitle: string,
  proficiencyLevel: string,
  passed: boolean
): string {
  const status = passed ? 'Certificate of Completion' : 'Certificate of Participation';
  return `${status} - ${testTitle}`;
}

/**
 * Calculate certificate expiry date based on test type
 */
export function calculateExpiryDate(
  testType: string,
  customExpiryMonths?: number
): Date | null {
  if (customExpiryMonths === 0) {return null;} // Never expires
  
  const months = customExpiryMonths || getDefaultExpiryMonths(testType);
  if (months === 0) {return null;}
  
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + months);
  return expiryDate;
}

/**
 * Get default expiry months based on test type
 */
function getDefaultExpiryMonths(testType: string): number {
  switch (testType) {
    case 'LANGUAGE':
      return 24; // 2 years
    case 'TECHNICAL':
      return 12; // 1 year
    case 'PROFESSIONAL':
      return 36; // 3 years
    case 'ACADEMIC':
      return 0; // Never expires
    default:
      return 24; // Default 2 years
  }
}