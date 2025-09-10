'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  Search, 
  Award, 
  Calendar,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import CertificateCard from './certificate-card';
import CertificateShareModal from './certificate-share-modal';
import { ExtendedCertificate } from '@/types';
import { useSession } from 'next-auth/react';

interface CertificateGalleryProps {
  userId?: string;
  showUserFilter?: boolean;
}

interface CertificatesResponse {
  success: boolean;
  certificates: ExtendedCertificate[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function CertificateGallery({ 
  userId, 
  showUserFilter = false 
}: CertificateGalleryProps) {
  const { data: session } = useSession();
  const [certificates, setCertificates] = useState<ExtendedCertificate[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValid, setFilterValid] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<ExtendedCertificate | null>(null);

  const targetUserId = userId || session?.user?.id;

  useEffect(() => {
    if (targetUserId) {
      fetchCertificates();
    }
  }, [targetUserId, currentPage, filterValid]);

  const fetchCertificates = async () => {
    if (!targetUserId) {return;}

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
      });

      if (filterValid !== 'all') {
        params.append('isValid', filterValid);
      }

      const response = await fetch(`/api/certificates/user/${targetUserId}?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch certificates');
      }

      const data: CertificatesResponse = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to fetch certificates');
      }

      setCertificates(data.certificates);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificateId: string) => {
    try {
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

      // Refresh certificates to update download count
      fetchCertificates();
    } catch (err) {
      console.error('Error downloading certificate:', err);
      alert('Failed to download certificate. Please try again.');
    }
  };

  const handleShare = (certificate: ExtendedCertificate) => {
    setSelectedCertificate(certificate);
    setShareModalOpen(true);
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

      // Refresh certificates to update email status
      fetchCertificates();
    } catch (err) {
      console.error('Error sending email:', err);
      throw err;
    }
  };

  const handleView = (certificateId: string) => {
    window.open(`/certificates/${certificateId}`, '_blank');
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = searchTerm === '' || 
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.testName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getFilterCounts = () => {
    const total = certificates.length;
    const valid = certificates.filter(c => c.isValid).length;
    const invalid = total - valid;
    
    return { total, valid, invalid };
  };

  const { total: totalCount, valid: validCount, invalid: invalidCount } = getFilterCounts();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Certificates</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchCertificates}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Certificates</h2>
          <p className="text-gray-600">
            {pagination?.totalCount || 0} certificate{(pagination?.totalCount || 0) !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={filterValid === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterValid('all')}
            >
              All ({totalCount})
            </Button>
            <Button
              variant={filterValid === 'true' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterValid('true')}
            >
              Valid ({validCount})
            </Button>
            <Button
              variant={filterValid === 'false' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterValid('false')}
            >
              Revoked ({invalidCount})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Grid */}
      {filteredCertificates.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Certificates Found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms.' : 'Complete tests to earn certificates.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCertificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              onDownload={handleDownload}
              onShare={handleShare}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={!pagination.hasPrev}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {[...Array(pagination.totalPages)].map((_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              const shouldShow = 
                page === 1 || 
                page === pagination.totalPages || 
                Math.abs(page - currentPage) <= 2;

              if (!shouldShow) {
                if (page === currentPage - 3 || page === currentPage + 3) {
                  return <span key={page} className="px-2">...</span>;
                }
                return null;
              }

              return (
                <Button
                  key={page}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={!pagination.hasNext}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Share Modal */}
      <CertificateShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        certificate={selectedCertificate}
        onEmailShare={handleEmailShare}
      />
    </div>
  );
}