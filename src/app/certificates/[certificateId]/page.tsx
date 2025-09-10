'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Share2, 
  Eye, 
  Calendar, 
  Award, 
  ExternalLink,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import CertificateShareModal from '@/components/certificates/certificate-share-modal';
import { ExtendedCertificate } from '@/types';

export default function CertificateDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const certificateId = params.certificateId as string;

  const [certificate, setCertificate] = useState<ExtendedCertificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (certificateId && session) {
      fetchCertificate();
    }
  }, [certificateId, session]);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/certificates/${certificateId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Certificate not found');
        } else if (response.status === 403) {
          throw new Error('Access denied');
        }
        throw new Error('Failed to fetch certificate');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch certificate');
      }

      setCertificate(data.certificate);
    } catch (err) {
      console.error('Error fetching certificate:', err);
      setError(err instanceof Error ? err.message : 'Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(`/api/certificates/${certificateId}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download certificate');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Refresh certificate to update download count
      fetchCertificate();
    } catch (err) {
      console.error('Error downloading certificate:', err);
      alert('Failed to download certificate. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEmailShare = async (certificateId: string, email: string) => {
    try {
      const response = await fetch(`/api/certificates/${certificateId}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      // Refresh certificate to update email status
      fetchCertificate();
    } catch (err) {
      console.error('Error sending email:', err);
      throw err;
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = () => {
    if (!certificate) return null;
    
    if (!certificate.isValid) {
      return <Badge variant="destructive">Revoked</Badge>;
    }
    
    if (certificate.expiryDate && new Date() > new Date(certificate.expiryDate)) {
      return <Badge variant="secondary">Expired</Badge>;
    }
    
    return <Badge variant="default">Valid</Badge>;
  };

  const getTemplateColor = () => {
    if (!certificate) return 'border-l-gray-500';
    
    switch (certificate.templateType) {
      case 'PROFESSIONAL':
        return 'border-l-blue-500';
      case 'ACADEMIC':
        return 'border-l-purple-500';
      case 'TECHNICAL':
        return 'border-l-orange-500';
      case 'LANGUAGE_PROFICIENCY':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <div className="space-x-2">
                  <Button onClick={() => router.back()}>Go Back</Button>
                  <Button variant="outline" onClick={fetchCertificate}>Try Again</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{certificate.title}</h1>
            <p className="text-gray-600 mt-2">Certificate Details</p>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Certificate Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className={`border-l-4 ${getTemplateColor()}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Certificate Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Recipient</h4>
                  <p className="text-gray-600">{certificate.recipientName}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Test Name</h4>
                  <p className="text-gray-600">{certificate.testName || certificate.test?.title}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Issue Date</h4>
                  <p className="text-gray-600">{formatDate(certificate.issueDate)}</p>
                </div>
                {certificate.expiryDate && (
                  <div>
                    <h4 className="font-semibold text-gray-900">Expiry Date</h4>
                    <p className="text-gray-600">{formatDate(certificate.expiryDate)}</p>
                  </div>
                )}
                {certificate.score !== null && (
                  <div>
                    <h4 className="font-semibold text-gray-900">Score</h4>
                    <p className="text-gray-600">{certificate.score}%</p>
                  </div>
                )}
                {certificate.proficiencyLevel && (
                  <div>
                    <h4 className="font-semibold text-gray-900">Proficiency Level</h4>
                    <p className="text-gray-600">{certificate.proficiencyLevel}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">Template Type</h4>
                  <p className="text-gray-600">{certificate.templateType.replace('_', ' ')}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Issued By</h4>
                  <p className="text-gray-600">{certificate.issuedBy}</p>
                </div>
              </div>

              {certificate.description && (
                <div>
                  <h4 className="font-semibold text-gray-900">Description</h4>
                  <p className="text-gray-600">{certificate.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Details */}
          {certificate.test && (
            <Card>
              <CardHeader>
                <CardTitle>Test Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Test Title</h4>
                    <p className="text-gray-600">{certificate.test.title}</p>
                  </div>
                  {certificate.test.category && (
                    <div>
                      <h4 className="font-semibold text-gray-900">Category</h4>
                      <p className="text-gray-600">{certificate.test.category.name}</p>
                    </div>
                  )}
                  {certificate.testAttempt && (
                    <>
                      <div>
                        <h4 className="font-semibold text-gray-900">Completion Date</h4>
                        <p className="text-gray-600">
                          {formatDate(certificate.testAttempt.completedAt)}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Result</h4>
                        <div className="flex items-center gap-2">
                          {certificate.testAttempt.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className={certificate.testAttempt.passed ? 'text-green-600' : 'text-red-600'}>
                            {certificate.testAttempt.passed ? 'Passed' : 'Failed'}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleDownload}
                disabled={isDownloading || !certificate.isValid}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </Button>
              
              {certificate.isValid && (
                <Button
                  variant="outline"
                  onClick={() => setShareModalOpen(true)}
                  className="w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Certificate
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => window.open(`/verify-certificate?code=${certificate.verificationCode}`, '_blank')}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Verify Online
              </Button>
            </CardContent>
          </Card>

          {/* Verification */}
          <Card>
            <CardHeader>
              <CardTitle>Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Verification Code</h4>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                  {certificate.verificationCode}
                </p>
              </div>
              <p className="text-xs text-gray-600">
                Use this code to verify the authenticity of this certificate on our verification page.
              </p>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Views</span>
                <span className="font-medium">{certificate.viewCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Downloads</span>
                <span className="font-medium">{certificate.downloadCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Email Sent</span>
                <span className="font-medium">
                  {certificate.emailSent ? 'Yes' : 'No'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Share Modal */}
      <CertificateShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        certificate={certificate}
        onEmailShare={handleEmailShare}
      />
    </div>
  );
}