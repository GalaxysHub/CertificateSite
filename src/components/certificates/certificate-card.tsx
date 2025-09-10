'use client';

import React, { useState } from 'react';
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
  Mail,
  Copy,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { ExtendedCertificate } from '@/types';

interface CertificateCardProps {
  certificate: ExtendedCertificate & {
    test?: {
      id: string;
      title: string;
      category?: {
        name: string;
        type: string;
      };
    };
    testAttempt?: {
      id: string;
      score: number;
      passed: boolean;
      completedAt: Date;
    };
  };
  onDownload?: (certificateId: string) => void;
  onShare?: (certificate: any) => void;
  onView?: (certificateId: string) => void;
}

export default function CertificateCard({
  certificate,
  onDownload,
  onShare,
  onView,
}: CertificateCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleDownload = async () => {
    if (!onDownload) return;
    
    setIsDownloading(true);
    try {
      await onDownload(certificate.id);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyVerificationCode = async () => {
    try {
      await navigator.clipboard.writeText(certificate.verificationCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy verification code:', err);
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = () => {
    if (!certificate.isValid) {
      return <Badge variant="destructive">Revoked</Badge>;
    }
    
    if (certificate.expiryDate && new Date() > new Date(certificate.expiryDate)) {
      return <Badge variant="secondary">Expired</Badge>;
    }
    
    return <Badge variant="default">Valid</Badge>;
  };

  const getTemplateColor = () => {
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

  return (
    <Card className={`border-l-4 ${getTemplateColor()} hover:shadow-lg transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {certificate.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Award className="w-4 h-4" />
              <span>{certificate.testName || certificate.test?.title}</span>
              {certificate.test?.category && (
                <>
                  <span>•</span>
                  <span className="text-blue-600">{certificate.test.category.name}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Certificate Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Recipient:</span>
            <p className="font-medium">{certificate.recipientName}</p>
          </div>
          <div>
            <span className="text-gray-600">Issue Date:</span>
            <p className="font-medium">{formatDate(certificate.issueDate)}</p>
          </div>
          {certificate.score !== null && (
            <div>
              <span className="text-gray-600">Score:</span>
              <p className="font-medium">{certificate.score}%</p>
            </div>
          )}
          {certificate.proficiencyLevel && (
            <div>
              <span className="text-gray-600">Level:</span>
              <p className="font-medium">{certificate.proficiencyLevel}</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{certificate.viewCount} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>{certificate.downloadCount} downloads</span>
          </div>
          {certificate.emailSent && (
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span>Emailed</span>
            </div>
          )}
        </div>

        {/* Verification Code */}
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-600">Verification Code:</span>
              <p className="font-mono text-sm">{certificate.verificationCode}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyVerificationCode}
              className="h-8 w-8 p-0"
            >
              {copySuccess ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading || !certificate.isValid}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
          
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(certificate.id)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          )}
          
          {onShare && certificate.isValid && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare(certificate)}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`/verify-certificate?code=${certificate.verificationCode}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* Expiry Warning */}
        {certificate.expiryDate && certificate.isValid && (
          (() => {
            const expiryDate = new Date(certificate.expiryDate);
            const now = new Date();
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
              return (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2">
                  <div className="flex items-center text-yellow-800 text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>Expires in {daysUntilExpiry} days ({formatDate(expiryDate)})</span>
                  </div>
                </div>
              );
            }
            return null;
          })()
        )}
      </CardContent>
    </Card>
  );
}