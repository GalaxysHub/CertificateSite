import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface CertificateEmailData {
  to: string;
  recipientName: string;
  testName: string;
  score?: number;
  proficiencyLevel?: string;
  verificationCode: string;
  certificateUrl: string;
  verificationUrl: string;
}

export class EmailService {
  private static instance: EmailService;
  private fromEmail: string;

  private constructor() {
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'certificates@yourplatform.com';
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Send certificate via email
   */
  async sendCertificate(data: CertificateEmailData): Promise<{ success: boolean; error?: string }> {
    try {
      if (!process.env.RESEND_API_KEY) {
        throw new Error('Resend API key not configured');
      }

      const emailHtml = this.generateCertificateEmailHtml(data);
      const emailText = this.generateCertificateEmailText(data);

      const result = await resend.emails.send({
        from: this.fromEmail,
        to: data.to,
        subject: `Your Certificate for ${data.testName}`,
        html: emailHtml,
        text: emailText,
      });

      if (result.error) {
        console.error('Resend error:', result.error);
        return { success: false, error: result.error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending certificate email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Generate HTML email template for certificate
   */
  private generateCertificateEmailHtml(data: CertificateEmailData): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Certificate</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
        }
        .header h1 {
            color: #2c3e50;
            margin: 0 0 10px 0;
            font-size: 28px;
        }
        .header p {
            color: #7f8c8d;
            margin: 0;
            font-size: 16px;
        }
        .certificate-info {
            background: #f8f9fa;
            border-left: 4px solid #3498db;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        .certificate-info h2 {
            color: #2c3e50;
            margin: 0 0 15px 0;
            font-size: 22px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }
        .info-item {
            padding: 10px 0;
        }
        .info-label {
            font-weight: 600;
            color: #34495e;
            margin-bottom: 5px;
        }
        .info-value {
            color: #2c3e50;
            font-size: 16px;
        }
        .verification-section {
            background: #e8f5e8;
            border: 1px solid #d4edda;
            border-radius: 6px;
            padding: 20px;
            margin: 30px 0;
            text-align: center;
        }
        .verification-code {
            font-family: 'Courier New', monospace;
            background: white;
            border: 1px solid #ced4da;
            border-radius: 4px;
            padding: 10px 15px;
            margin: 10px 0;
            font-size: 16px;
            letter-spacing: 1px;
            word-break: break-all;
        }
        .btn {
            display: inline-block;
            background: #3498db;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            margin: 10px 5px;
            transition: background-color 0.3s;
        }
        .btn:hover {
            background: #2980b9;
        }
        .btn-secondary {
            background: #6c757d;
        }
        .btn-secondary:hover {
            background: #5a6268;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #7f8c8d;
            font-size: 14px;
        }
        .congratulations {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
        }
        .congratulations h2 {
            margin: 0 0 10px 0;
            font-size: 24px;
        }
        .congratulations p {
            margin: 0;
            opacity: 0.9;
        }
        @media (max-width: 600px) {
            .info-grid {
                grid-template-columns: 1fr;
            }
            .container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Certificate Earned!</h1>
            <p>Professional Certification Platform</p>
        </div>

        <div class="congratulations">
            <h2>Congratulations, ${data.recipientName}!</h2>
            <p>You have successfully earned your certificate for completing the ${data.testName} assessment.</p>
        </div>

        <div class="certificate-info">
            <h2>Certificate Details</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Test Name</div>
                    <div class="info-value">${data.testName}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Recipient</div>
                    <div class="info-value">${data.recipientName}</div>
                </div>
                ${data.score !== undefined ? `
                <div class="info-item">
                    <div class="info-label">Score</div>
                    <div class="info-value">${data.score}%</div>
                </div>
                ` : ''}
                ${data.proficiencyLevel ? `
                <div class="info-item">
                    <div class="info-label">Proficiency Level</div>
                    <div class="info-value">${data.proficiencyLevel}</div>
                </div>
                ` : ''}
                <div class="info-item">
                    <div class="info-label">Issue Date</div>
                    <div class="info-value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
            </div>
        </div>

        <div class="verification-section">
            <h3 style="margin: 0 0 10px 0; color: #155724;">Certificate Verification</h3>
            <p style="margin: 0 0 15px 0; color: #155724;">Your certificate can be verified using the code below:</p>
            <div class="verification-code">${data.verificationCode}</div>
            <p style="margin: 15px 0 0 0; color: #155724; font-size: 14px;">
                Anyone can verify the authenticity of this certificate by visiting our verification page.
            </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="${data.certificateUrl}" class="btn">📄 Download Certificate</a>
            <a href="${data.verificationUrl}" class="btn btn-secondary">🔍 Verify Certificate</a>
        </div>

        <div style="background: #f8f9fa; border-radius: 6px; padding: 20px; margin: 30px 0;">
            <h4 style="margin: 0 0 10px 0; color: #2c3e50;">What's Next?</h4>
            <ul style="margin: 0; padding-left: 20px; color: #34495e;">
                <li>Download your certificate using the link above</li>
                <li>Share your achievement on social media</li>
                <li>Add this certificate to your professional portfolio</li>
                <li>Continue learning with our other certification programs</li>
            </ul>
        </div>

        <div class="footer">
            <p>This certificate was issued by Professional Certification Platform</p>
            <p>If you have any questions, please contact our support team.</p>
            <p style="margin-top: 20px; font-size: 12px;">
                This email was sent because you completed a certification test. 
                The certificate and verification code in this email are unique to you.
            </p>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Generate plain text email for certificate
   */
  private generateCertificateEmailText(data: CertificateEmailData): string {
    return `
🎓 CERTIFICATE EARNED!

Congratulations, ${data.recipientName}!

You have successfully earned your certificate for completing the ${data.testName} assessment.

CERTIFICATE DETAILS:
- Test Name: ${data.testName}
- Recipient: ${data.recipientName}
${data.score !== undefined ? `- Score: ${data.score}%\n` : ''}${data.proficiencyLevel ? `- Proficiency Level: ${data.proficiencyLevel}\n` : ''}- Issue Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

VERIFICATION CODE: ${data.verificationCode}

Your certificate can be verified using the code above at our verification page.

DOWNLOAD YOUR CERTIFICATE:
${data.certificateUrl}

VERIFY YOUR CERTIFICATE:
${data.verificationUrl}

WHAT'S NEXT?
• Download your certificate using the link above
• Share your achievement on social media  
• Add this certificate to your professional portfolio
• Continue learning with our other certification programs

---
This certificate was issued by Professional Certification Platform.
If you have any questions, please contact our support team.

This email was sent because you completed a certification test. 
The certificate and verification code in this email are unique to you.
    `;
  }

  /**
   * Send certificate notification to admin/instructor
   */
  async sendCertificateNotification(data: {
    to: string;
    recipientName: string;
    testName: string;
    score: number;
    verificationCode: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await resend.emails.send({
        from: this.fromEmail,
        to: data.to,
        subject: `New Certificate Issued - ${data.testName}`,
        html: `
          <h2>New Certificate Issued</h2>
          <p>A new certificate has been issued for the test: <strong>${data.testName}</strong></p>
          <ul>
            <li><strong>Recipient:</strong> ${data.recipientName}</li>
            <li><strong>Score:</strong> ${data.score}%</li>
            <li><strong>Verification Code:</strong> ${data.verificationCode}</li>
            <li><strong>Issue Date:</strong> ${new Date().toLocaleDateString()}</li>
          </ul>
        `,
        text: `
New Certificate Issued

A new certificate has been issued for the test: ${data.testName}

Recipient: ${data.recipientName}
Score: ${data.score}%
Verification Code: ${data.verificationCode}
Issue Date: ${new Date().toLocaleDateString()}
        `,
      });

      if (result.error) {
        return { success: false, error: result.error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending notification email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}