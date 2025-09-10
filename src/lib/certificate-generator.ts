import { renderToBuffer } from '@react-pdf/renderer';
import { db } from './db';
import {
  generateVerificationCode,
  generateQRCode,
  calculateProficiencyLevel,
  getCertificateTemplate,
  logCertificateAction,
  generateCertificateFilePath,
  sanitizeCertificateData,
  formatCertificateDate,
  generateCertificateTitle,
  calculateExpiryDate,
} from './certificate';
import CertificateTemplate from '@/components/certificates/certificate-template';
import { CertificateData, CertificateTemplate as CertificateTemplateType } from '@/types';
import fs from 'fs/promises';
import path from 'path';

interface GenerateCertificateOptions {
  testAttemptId: string;
  templateType?: CertificateTemplateType;
  recipientName?: string;
  customData?: Record<string, any>;
  performedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

interface CertificateGenerationResult {
  success: boolean;
  certificateId?: string;
  verificationCode?: string;
  filePath?: string;
  error?: string;
}

export class CertificateGenerator {
  private static instance: CertificateGenerator;

  public static getInstance(): CertificateGenerator {
    if (!CertificateGenerator.instance) {
      CertificateGenerator.instance = new CertificateGenerator();
    }
    return CertificateGenerator.instance;
  }

  /**
   * Generate a certificate for a test attempt
   */
  async generateCertificate(options: GenerateCertificateOptions): Promise<CertificateGenerationResult> {
    try {
      // Get test attempt with related data
      const testAttempt = await db.testAttempt.findUnique({
        where: { id: options.testAttemptId },
        include: {
          test: {
            include: {
              category: true,
              creator: true,
            },
          },
          user: true,
          certificate: true, // Check if certificate already exists
        },
      });

      if (!testAttempt) {
        return { success: false, error: 'Test attempt not found' };
      }

      if (testAttempt.certificate) {
        return {
          success: false,
          error: 'Certificate already exists for this test attempt',
        };
      }

      if (!testAttempt.completedAt) {
        return { success: false, error: 'Test attempt not completed' };
      }

      // Generate certificate data
      const verificationCode = generateVerificationCode();
      const qrCodeDataUrl = await generateQRCode(verificationCode);
      
      const recipientName = options.recipientName || testAttempt.user.name || 'Test Taker';
      const proficiencyLevel = calculateProficiencyLevel(
        testAttempt.score,
        testAttempt.test.category.type,
        testAttempt.test.level
      );
      
      const templateType = options.templateType || 
        getCertificateTemplate(testAttempt.test.category.type);

      const certificateData: CertificateData = {
        recipientName,
        courseName: testAttempt.test.title,
        completionDate: formatCertificateDate(testAttempt.completedAt),
        score: testAttempt.score,
        proficiencyLevel,
        instructorName: testAttempt.test.creator.name || 'Certification Authority',
        organizationName: 'Certificate Testing Platform',
        testDuration: testAttempt.test.duration,
        totalQuestions: testAttempt.test.totalQuestions,
        passingScore: testAttempt.test.passingScore,
        ...sanitizeCertificateData(options.customData || {}),
      };

      // Generate PDF
      const pdfBuffer = await this.generatePDF({
        data: certificateData,
        templateType,
        qrCodeDataUrl,
        verificationCode,
        issueDate: formatCertificateDate(new Date()),
      });

      // Create certificate record in database
      const certificate = await db.certificate.create({
        data: {
          userId: testAttempt.userId,
          testAttemptId: testAttempt.id,
          testId: testAttempt.testId,
          verificationCode,
          title: generateCertificateTitle(
            testAttempt.test.title,
            proficiencyLevel,
            testAttempt.passed
          ),
          description: `Certificate for completing ${testAttempt.test.title}`,
          recipientName,
          testName: testAttempt.test.title,
          score: testAttempt.score,
          proficiencyLevel,
          templateType,
          qrCodeData: qrCodeDataUrl,
          certificateData: sanitizeCertificateData(certificateData),
          expiryDate: calculateExpiryDate(testAttempt.test.category.type),
          issuedBy: options.performedBy || 'SYSTEM',
        },
      });

      // Save PDF file
      const filePath = await this.savePDFFile(
        pdfBuffer,
        testAttempt.userId,
        certificate.id
      );

      // Update certificate with file path
      await db.certificate.update({
        where: { id: certificate.id },
        data: { filePath },
      });

      // Log certificate generation
      await logCertificateAction(
        certificate.id,
        'GENERATED',
        options.performedBy,
        options.ipAddress,
        options.userAgent,
        {
          testAttemptId: testAttempt.id,
          templateType,
          score: testAttempt.score,
        }
      );

      return {
        success: true,
        certificateId: certificate.id,
        verificationCode: certificate.verificationCode,
        filePath,
      };
    } catch (error) {
      console.error('Error generating certificate:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Generate PDF buffer from certificate template
   */
  private async generatePDF(props: {
    data: CertificateData;
    templateType: CertificateTemplateType;
    qrCodeDataUrl: string;
    verificationCode: string;
    issueDate: string;
  }): Promise<Buffer> {
    try {
      const certificateComponent = CertificateTemplate(props);
      const pdfBuffer = await renderToBuffer(certificateComponent);
      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF certificate');
    }
  }

  /**
   * Save PDF file to filesystem
   */
  private async savePDFFile(
    pdfBuffer: Buffer,
    userId: string,
    certificateId: string
  ): Promise<string> {
    try {
      const filePath = generateCertificateFilePath(userId, certificateId);
      const fullPath = path.join(process.cwd(), 'public', filePath);
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      
      // Write file
      await fs.writeFile(fullPath, pdfBuffer);
      
      return filePath;
    } catch (error) {
      console.error('Error saving PDF file:', error);
      throw new Error('Failed to save certificate file');
    }
  }

  /**
   * Regenerate certificate (e.g., for template updates)
   */
  async regenerateCertificate(
    certificateId: string,
    options?: {
      templateType?: CertificateTemplateType;
      performedBy?: string;
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<CertificateGenerationResult> {
    try {
      const certificate = await db.certificate.findUnique({
        where: { id: certificateId },
        include: {
          testAttempt: {
            include: {
              test: {
                include: {
                  category: true,
                  creator: true,
                },
              },
              user: true,
            },
          },
        },
      });

      if (!certificate || !certificate.testAttempt) {
        return { success: false, error: 'Certificate not found' };
      }

      // Update template type if provided
      const templateType = options?.templateType || certificate.templateType;
      
      // Regenerate QR code and PDF
      const qrCodeDataUrl = await generateQRCode(certificate.verificationCode);
      const certificateData = certificate.certificateData as CertificateData;

      const pdfBuffer = await this.generatePDF({
        data: certificateData,
        templateType,
        qrCodeDataUrl,
        verificationCode: certificate.verificationCode,
        issueDate: formatCertificateDate(certificate.issueDate),
      });

      // Save new PDF file
      const filePath = await this.savePDFFile(
        pdfBuffer,
        certificate.userId,
        certificate.id
      );

      // Update certificate record
      await db.certificate.update({
        where: { id: certificateId },
        data: {
          templateType,
          qrCodeData: qrCodeDataUrl,
          filePath,
          updatedAt: new Date(),
        },
      });

      // Log regeneration
      await logCertificateAction(
        certificateId,
        'GENERATED',
        options?.performedBy,
        options?.ipAddress,
        options?.userAgent,
        {
          regenerated: true,
          templateType,
        }
      );

      return {
        success: true,
        certificateId,
        verificationCode: certificate.verificationCode,
        filePath,
      };
    } catch (error) {
      console.error('Error regenerating certificate:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Revoke a certificate
   */
  async revokeCertificate(
    certificateId: string,
    reason: string,
    options?: {
      performedBy?: string;
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await db.certificate.update({
        where: { id: certificateId },
        data: {
          isValid: false,
          revokedAt: new Date(),
          revokedReason: reason,
        },
      });

      await logCertificateAction(
        certificateId,
        'REVOKED',
        options?.performedBy,
        options?.ipAddress,
        options?.userAgent,
        { reason }
      );

      return { success: true };
    } catch (error) {
      console.error('Error revoking certificate:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Restore a revoked certificate
   */
  async restoreCertificate(
    certificateId: string,
    options?: {
      performedBy?: string;
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await db.certificate.update({
        where: { id: certificateId },
        data: {
          isValid: true,
          revokedAt: null,
          revokedReason: null,
        },
      });

      await logCertificateAction(
        certificateId,
        'RESTORED',
        options?.performedBy,
        options?.ipAddress,
        options?.userAgent
      );

      return { success: true };
    } catch (error) {
      console.error('Error restoring certificate:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}