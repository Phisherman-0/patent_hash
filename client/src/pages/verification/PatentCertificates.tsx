import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Award, Download, Share2, QrCode, Calendar, Shield, FileText, RefreshCw, CheckCircle, ExternalLink } from "lucide-react";

export default function PatentCertificates() {
  const { toast } = useToast();
  const [selectedPatent, setSelectedPatent] = useState<any>(null);
  const [certificateView, setCertificateView] = useState(false);

  const { data: patents, isLoading: loadingPatents } = useQuery({
    queryKey: ['/api/patents'],
  });

  const generateCertificateMutation = useMutation({
    mutationFn: async (patentId: string) => {
      // Mock certificate generation - in real implementation, this would generate a blockchain certificate
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        certificateId: `CERT-${Date.now()}`,
        generatedAt: new Date().toISOString(),
        qrCode: `data:image/svg+xml;base64,${btoa(`
          <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="white"/>
            <rect x="10" y="10" width="80" height="80" fill="black"/>
          </svg>
        `)}`,
        verificationUrl: `https://verify.patenthash.com/cert/${patentId}`,
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Certificate Generated",
        description: "Patent certificate has been generated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/patents'] });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate certificate. Please try again.",
        variant: "destructive",
      });
    },
  });

  const downloadCertificate = (patent: any) => {
    // Mock certificate download
    const certificateContent = `
BLOCKCHAIN PATENT CERTIFICATE

Certificate ID: CERT-${Date.now()}
Issue Date: ${new Date().toLocaleDateString()}

PATENT INFORMATION
Title: ${patent.title}
Patent ID: ${patent.id}
Status: ${patent.status}
Category: ${patent.category}
Created: ${patent.createdAt}

BLOCKCHAIN VERIFICATION
Hedera Topic ID: ${patent.hederaTopicId || 'N/A'}
Hedera Message ID: ${patent.hederaMessageId || 'N/A'}
NFT ID: ${patent.hederaNftId || 'N/A'}
Hash Value: ${patent.hashValue || 'N/A'}

This certificate verifies that the above patent has been registered
and timestamped on the Hedera blockchain network, providing immutable
proof of existence and ownership.

Verification URL: https://verify.patenthash.com/cert/${patent.id}

© Patent Hash Platform - Blockchain-Powered Patent Protection
    `.trim();

    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patent_certificate_${patent.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Certificate Downloaded",
      description: "Patent certificate has been downloaded successfully.",
    });
  };

  const shareCertificate = async (patent: any) => {
    const shareData = {
      title: `Patent Certificate - ${patent.title}`,
      text: `Verified patent certificate for "${patent.title}" on Patent Hash blockchain platform.`,
      url: `https://verify.patenthash.com/cert/${patent.id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Certificate Shared",
          description: "Patent certificate link has been shared successfully.",
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareData.url);
      toast({
        title: "Link Copied",
        description: "Certificate verification link has been copied to clipboard.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "default";
      case "pending": return "secondary";
      case "under_review": return "outline";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  if (loadingPatents) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Patent Certificates</h1>
          <p className="text-muted-foreground mt-2">
            Generate and manage blockchain-verified patent certificates
          </p>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-96" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-10 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Patent Certificates</h1>
        <p className="text-muted-foreground mt-2">
          Generate blockchain-verified certificates for your patents with QR codes and verification links for global authentication
        </p>
      </div>

      {/* Certificates Grid */}
      <div className="grid gap-6">
        {patents && patents.length > 0 ? (
          patents.map((patent: any) => (
            <Card key={patent.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      {patent.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Patent ID: {patent.id} • Created: {formatDate(patent.createdAt)}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusColor(patent.status)}>
                    {patent.status?.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Patent Info */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Category</p>
                      <p className="text-sm">{patent.category?.replace('_', ' ') || 'Not specified'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Blockchain Status</p>
                      <div className="flex items-center gap-2">
                        {patent.hederaTopicId ? (
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-600">
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Estimated Value</p>
                      <p className="text-sm">
                        {patent.estimatedValue 
                          ? `$${parseFloat(patent.estimatedValue).toLocaleString()}` 
                          : 'Not valuated'}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedPatent(patent)}
                        >
                          <Award className="h-4 w-4 mr-2" />
                          View Certificate
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Patent Certificate</DialogTitle>
                          <DialogDescription>
                            Blockchain-verified certificate for {patent.title}
                          </DialogDescription>
                        </DialogHeader>
                        
                        {/* Certificate Content */}
                        <div className="space-y-6">
                          {/* Certificate Header */}
                          <div className="text-center space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg">
                            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto">
                              <Award className="h-8 w-8 text-white" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold">BLOCKCHAIN PATENT CERTIFICATE</h2>
                              <p className="text-muted-foreground">
                                Verified on Hedera Blockchain Network
                              </p>
                            </div>
                          </div>

                          {/* Certificate Body */}
                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold mb-3">Patent Information</h3>
                                <div className="space-y-2 text-sm">
                                  <div><strong>Title:</strong> {patent.title}</div>
                                  <div><strong>Patent ID:</strong> {patent.id}</div>
                                  <div><strong>Status:</strong> {patent.status}</div>
                                  <div><strong>Category:</strong> {patent.category?.replace('_', ' ')}</div>
                                  <div><strong>Created:</strong> {formatDate(patent.createdAt)}</div>
                                </div>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-3">Blockchain Verification</h3>
                                <div className="space-y-2 text-sm">
                                  <div><strong>Topic ID:</strong> {patent.hederaTopicId || 'N/A'}</div>
                                  <div><strong>Message ID:</strong> {patent.hederaMessageId || 'N/A'}</div>
                                  <div><strong>NFT ID:</strong> {patent.hederaNftId || 'N/A'}</div>
                                  <div><strong>Hash:</strong> {patent.hashValue?.substring(0, 20) || 'N/A'}...</div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {/* QR Code */}
                              <div className="text-center">
                                <h3 className="font-semibold mb-3">Verification QR Code</h3>
                                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto">
                                  <QrCode className="h-16 w-16 text-gray-500" />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Scan to verify certificate authenticity
                                </p>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-3">Certificate Details</h3>
                                <div className="space-y-2 text-sm">
                                  <div><strong>Certificate ID:</strong> CERT-{patent.id.substring(0, 8)}</div>
                                  <div><strong>Issue Date:</strong> {new Date().toLocaleDateString()}</div>
                                  <div><strong>Valid Until:</strong> Perpetual</div>
                                  <div><strong>Authority:</strong> Patent Hash Platform</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Certificate Footer */}
                          <div className="text-center space-y-4 p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              This certificate verifies that the above patent has been registered and timestamped on the Hedera blockchain network, 
                              providing immutable proof of existence and ownership.
                            </p>
                            <div className="flex items-center justify-center gap-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadCertificate(patent)}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => shareCertificate(patent)}
                              >
                                <Share2 className="h-3 w-3 mr-1" />
                                Share
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`https://verify.patenthash.com/cert/${patent.id}`, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Verify Online
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      onClick={() => downloadCertificate(patent)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => shareCertificate(patent)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>

                    {!patent.hederaTopicId && (
                      <Button
                        variant="outline"
                        onClick={() => generateCertificateMutation.mutate(patent.id)}
                        disabled={generateCertificateMutation.isPending}
                      >
                        {generateCertificateMutation.isPending ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Shield className="h-4 w-4 mr-2" />
                        )}
                        Generate Certificate
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Award className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Patents for Certificates</h3>
              <p className="text-muted-foreground text-center">
                File your first patent to generate blockchain-verified certificates with global verification capabilities.
              </p>
              <Button className="mt-4">
                <FileText className="h-4 w-4 mr-2" />
                File Your First Patent
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Certificate Features */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Blockchain Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Certificates are secured by Hedera blockchain technology with cryptographic verification and immutable timestamps.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <QrCode className="h-4 w-4" />
              QR Code Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Each certificate includes a QR code for instant verification by scanning with any smartphone or QR reader.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ExternalLink className="h-4 w-4" />
              Global Recognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Certificates can be verified globally by anyone using the verification URL and are recognized internationally.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}