"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Award,
  Download,
  Share,
  Search,
  Filter,
  Calendar,
  Shield,
  ExternalLink,
  Eye,
  Mail,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  TrendingUp
} from "lucide-react";
import CertificateShareModal from "@/components/certificates/certificate-share-modal";

interface CertificateData {
  id: string;
  title: string;
  description: string;
  recipientName: string;
  testName: string;
  score: number;
  proficiencyLevel: string;
  issueDate: string;
  expiryDate: string | null;
  templateType: string;
  verificationCode: string;
  downloadCount: number;
  viewCount: number;
  isValid: boolean;
  filePath: string | null;
}

export function DashboardCertificatesView() {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  const filters = [
    { value: "all", label: "All Certificates" },
    { value: "valid", label: "Valid" },
    { value: "expiring", label: "Expiring Soon" },
    { value: "expired", label: "Expired" }
  ];

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates/user/me');
      if (!response.ok) throw new Error('Failed to fetch certificates');
      
      const data = await response.json();
      setCertificates(data.certificates || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificateId: string) => {
    try {
      const response = await fetch(`/api/certificates/${certificateId}/download`);
      if (!response.ok) throw new Error('Download failed');
      
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
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleShare = (certificate: CertificateData) => {
    setSelectedCertificate(certificate);
    setShareModalOpen(true);
  };

  const getTemplateColor = (templateType: string) => {
    switch (templateType.toLowerCase()) {
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      case 'academic': return 'bg-green-100 text-green-800';
      case 'technical': return 'bg-orange-100 text-orange-800';
      case 'language_proficiency': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProficiencyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
      case 'a1':
      case 'a2':
        return 'text-green-600';
      case 'intermediate':
      case 'b1':
      case 'b2':
        return 'text-yellow-600';
      case 'advanced':
      case 'c1':
      case 'c2':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const isExpiring = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    return expiry <= thirtyDaysFromNow && expiry > now;
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) <= new Date();
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.testName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.proficiencyLevel?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" ||
                         (selectedFilter === "valid" && cert.isValid && !isExpired(cert.expiryDate)) ||
                         (selectedFilter === "expiring" && isExpiring(cert.expiryDate)) ||
                         (selectedFilter === "expired" && isExpired(cert.expiryDate));
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Certificates</h1>
          <p className="text-muted-foreground">
            Manage your earned certificates and achievements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button size="sm" asChild>
            <Link href="/certificates">
              <ExternalLink className="h-4 w-4 mr-2" />
              Public Gallery
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{certificates.length}</p>
                <p className="text-sm text-muted-foreground">Total Certificates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {certificates.filter(c => c.isValid && !isExpired(c.expiryDate)).length}
                </p>
                <p className="text-sm text-muted-foreground">Valid</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {certificates.filter(c => isExpiring(c.expiryDate)).length}
                </p>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {certificates.reduce((sum, c) => sum + c.downloadCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="p-2 border border-input rounded-md bg-background text-sm min-w-[150px]"
              >
                {filters.map(filter => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>
              
              <div className="border rounded-md p-1">
                <Button
                  variant={view === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("grid")}
                  className="p-2"
                >
                  Grid
                </Button>
                <Button
                  variant={view === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("list")}
                  className="p-2"
                >
                  List
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Certificates Display */}
      {filteredCertificates.length === 0 ? (
        <div className="text-center py-12">
          <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">
            {certificates.length === 0 ? "No certificates yet" : "No certificates match your criteria"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {certificates.length === 0 
              ? "Complete tests to earn your first certificate!" 
              : "Try adjusting your search or filter criteria."
            }
          </p>
          <Button asChild>
            <Link href="/tests">Take a Test</Link>
          </Button>
        </div>
      ) : (
        <div className={view === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredCertificates.map((certificate) => (
            <Card key={certificate.id} className={`hover:shadow-md transition-all ${
              view === "list" ? "p-0" : ""
            } ${!certificate.isValid || isExpired(certificate.expiryDate) ? "opacity-70" : ""}`}>
              {view === "grid" ? (
                <>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2 flex items-center space-x-2">
                          <span>{certificate.title}</span>
                          {isExpiring(certificate.expiryDate) && (
                            <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                          )}
                          {isExpired(certificate.expiryDate) && (
                            <Clock className="h-4 w-4 text-red-600 flex-shrink-0" />
                          )}
                        </CardTitle>
                        <CardDescription>{certificate.testName}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Certificate preview area */}
                    <div className="h-32 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="text-center">
                        <Award className="h-12 w-12 mx-auto mb-2 text-primary" />
                        <p className="text-xs font-medium text-primary">{certificate.templateType}</p>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className={getTemplateColor(certificate.templateType)}>
                          {certificate.templateType.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    {/* Certificate info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Score</span>
                        <span className="font-medium">{certificate.score}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Level</span>
                        <span className={`font-medium ${getProficiencyColor(certificate.proficiencyLevel)}`}>
                          {certificate.proficiencyLevel}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Issued</span>
                        <span className="font-medium">
                          {new Date(certificate.issueDate).toLocaleDateString()}
                        </span>
                      </div>
                      {certificate.expiryDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Expires</span>
                          <span className={`font-medium ${
                            isExpired(certificate.expiryDate) 
                              ? 'text-red-600' 
                              : isExpiring(certificate.expiryDate) 
                                ? 'text-yellow-600' 
                                : 'text-green-600'
                          }`}>
                            {new Date(certificate.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{certificate.viewCount} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>{certificate.downloadCount} downloads</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownload(certificate.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleShare(certificate)}
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/certificates/${certificate.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate flex items-center space-x-2">
                        <span>{certificate.title}</span>
                        {isExpiring(certificate.expiryDate) && (
                          <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                        )}
                        {isExpired(certificate.expiryDate) && (
                          <Clock className="h-4 w-4 text-red-600 flex-shrink-0" />
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">{certificate.testName}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span>Score: <strong>{certificate.score}%</strong></span>
                        <span>Level: <strong className={getProficiencyColor(certificate.proficiencyLevel)}>{certificate.proficiencyLevel}</strong></span>
                        <span>Issued: <strong>{new Date(certificate.issueDate).toLocaleDateString()}</strong></span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleDownload(certificate.id)}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleShare(certificate)}>
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {selectedCertificate && (
        <CertificateShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          certificate={selectedCertificate}
        />
      )}
    </div>
  );
}