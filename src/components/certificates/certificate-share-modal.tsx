'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Copy, 
  CheckCircle, 
  ExternalLink,
  QrCode,
  Download,
  Share2,
} from 'lucide-react';
import { ExtendedCertificate } from '@/types';

interface CertificateShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: any;
  onEmailShare?: (certificateId: string, email: string) => Promise<void>;
}

export default function CertificateShareModal({
  open,
  onOpenChange,
  certificate,
  onEmailShare,
}: CertificateShareModalProps) {
  const [email, setEmail] = useState('');
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  if (!certificate) return null;

  const verificationUrl = `${window.location.origin}/verify-certificate?code=${certificate.verificationCode}`;

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEmailShare = async () => {
    if (!email.trim() || !onEmailShare) return;

    setIsEmailSending(true);
    try {
      await onEmailShare(certificate.id, email.trim());
      setEmailSent(true);
      setEmail('');
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setEmailSent(false);
    setCopySuccess(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Certificate
          </DialogTitle>
          <DialogDescription>
            Share your certificate with others or verify its authenticity
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Certificate Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm text-gray-900 mb-2">{certificate.title}</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Recipient: {certificate.recipientName}</p>
              <p>Verification: {certificate.verificationCode}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={certificate.isValid ? 'default' : 'destructive'}>
                  {certificate.isValid ? 'Valid' : 'Revoked'}
                </Badge>
                {certificate.score && (
                  <Badge variant="secondary">Score: {certificate.score}%</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Verification URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={verificationUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(verificationUrl, 'url')}
              >
                {copySuccess === 'url' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Anyone can verify the certificate using this URL
            </p>
          </div>

          {/* Verification Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={certificate.verificationCode}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(certificate.verificationCode, 'code')}
              >
                {copySuccess === 'code' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter this code at the verification page
            </p>
          </div>

          {/* Email Share */}
          {onEmailShare && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share via Email
              </label>
              {emailSent ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex items-center text-green-800 text-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Certificate shared successfully!
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <Button
                    onClick={handleEmailShare}
                    disabled={!email.trim() || isEmailSending}
                    size="sm"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {isEmailSending ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => window.open(verificationUrl, '_blank')}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Verification
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(`/certificates/${certificate.id}/download`, '_blank')}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>

          {/* QR Code Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start">
              <QrCode className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
              <div className="text-sm text-blue-800">
                <h5 className="font-medium">QR Code Available</h5>
                <p className="text-blue-700">
                  The PDF certificate includes a QR code for quick verification
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}