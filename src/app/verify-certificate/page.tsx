'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Search, AlertTriangle } from 'lucide-react';
import { CertificateVerificationData } from '@/types';

function CertificateVerificationContent() {
  const searchParams = useSearchParams();
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<CertificateVerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if verification code is provided in URL (from QR code)
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setVerificationCode(codeFromUrl);
      verifyCode(codeFromUrl);
    }
  }, [searchParams]);

  const verifyCode = async (code: string) => {
    if (!code.trim()) {
      setError('Please enter a verification code');
      return;
    }

    setIsLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      const response = await fetch('/api/certificates/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationCode: code.trim() }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Verification failed');
        return;
      }

      setVerificationResult(data);
    } catch (err) {
      console.error('Verification error:', err);
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCode(verificationCode);
  };

  const getStatusIcon = () => {
    if (!verificationResult) {return null;}
    
    if (verificationResult.isValid) {
      return <CheckCircle className="w-8 h-8 text-green-500" />;
    } else {
      return <XCircle className="w-8 h-8 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    if (!verificationResult) {return 'default';}
    return verificationResult.isValid ? 'default' : 'destructive';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Certificate Verification
          </h1>
          <p className="text-lg text-gray-600">
            Enter a verification code to validate a certificate's authenticity
          </p>
        </div>

        {/* Verification Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Verify Certificate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  id="verification-code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter verification code (e.g., CERT-123ABC-DEF456)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !verificationCode.trim()}
                className="w-full"
              >
                {isLoading ? 'Verifying...' : 'Verify Certificate'}
              </Button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Result */}
        {verificationResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {getStatusIcon()}
                <span>Verification Result</span>
                <Badge variant={getStatusColor()}>
                  {verificationResult.isValid ? 'Valid' : 'Invalid'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {verificationResult.isValid && verificationResult.certificateData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Recipient</h3>
                      <p className="text-gray-600">{verificationResult.certificateData.recipientName}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Test Name</h3>
                      <p className="text-gray-600">{verificationResult.certificateData.testName}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Issue Date</h3>
                      <p className="text-gray-600">{formatDate(verificationResult.certificateData.issueDate)}</p>
                    </div>
                    {verificationResult.certificateData.completionDate && (
                      <div>
                        <h3 className="font-semibold text-gray-900">Completion Date</h3>
                        <p className="text-gray-600">{formatDate(verificationResult.certificateData.completionDate)}</p>
                      </div>
                    )}
                    {verificationResult.certificateData.score !== undefined && (
                      <div>
                        <h3 className="font-semibold text-gray-900">Score</h3>
                        <p className="text-gray-600">{verificationResult.certificateData.score}%</p>
                      </div>
                    )}
                    {verificationResult.certificateData.proficiencyLevel && (
                      <div>
                        <h3 className="font-semibold text-gray-900">Proficiency Level</h3>
                        <p className="text-gray-600">{verificationResult.certificateData.proficiencyLevel}</p>
                      </div>
                    )}
                    {verificationResult.certificateData.testCategory && (
                      <div>
                        <h3 className="font-semibold text-gray-900">Category</h3>
                        <p className="text-gray-600">{verificationResult.certificateData.testCategory}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">Issued By</h3>
                      <p className="text-gray-600">{verificationResult.certificateData.organizationName}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Verification Code</h3>
                    <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
                      {verificationResult.verificationCode}
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <div>
                        <h4 className="font-semibold text-green-800">Certificate is Valid</h4>
                        <p className="text-green-700 text-sm">
                          This certificate has been verified as authentic and has not been revoked.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex items-center">
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    <div>
                      <h4 className="font-semibold text-red-800">Certificate is Invalid</h4>
                      <p className="text-red-700 text-sm">
                        {verificationResult.error || 'This certificate could not be verified or has been revoked.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Information Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>About Certificate Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-600">
            <p>
              Our certificate verification system ensures the authenticity and validity of certificates
              issued by our platform. Each certificate contains a unique verification code that can be
              used to confirm its legitimacy.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">How to verify:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Enter the verification code found on the certificate</li>
                <li>Scan the QR code on the certificate (if available)</li>
                <li>Check the verification result for authenticity confirmation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Security features:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Unique verification codes for each certificate</li>
                <li>Real-time validation against our secure database</li>
                <li>Tamper-proof QR codes for quick verification</li>
                <li>Audit trail for all verification attempts</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CertificateVerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Certificate Verification
            </h1>
            <p className="text-lg text-gray-600">
              Loading verification interface...
            </p>
          </div>
        </div>
      </div>
    }>
      <CertificateVerificationContent />
    </Suspense>
  );
}