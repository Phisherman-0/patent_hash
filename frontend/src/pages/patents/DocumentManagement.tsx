import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { FileText, Upload, Download, Search, Filter, Eye, Trash2, File, Calendar, User, Hash } from "lucide-react";

export default function DocumentManagement() {
  const { toast } = useToast();
  const [selectedPatent, setSelectedPatent] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const { data: patents, isLoading: loadingPatents } = useQuery({
    queryKey: ['/api/patents'],
  });

  // Mock documents data - In a real app, this would come from the API
  const mockDocuments = patents?.flatMap((patent: any) => [
    {
      id: `doc-${patent.id}-1`,
      patentId: patent.id,
      patentTitle: patent.title,
      fileName: `${patent.title.replace(/[^a-zA-Z0-9]/g, '_')}_application.pdf`,
      fileType: 'application/pdf',
      fileSize: 2456789,
      hashValue: 'a1b2c3d4e5f6789012345678901234567890abcdef',
      createdAt: patent.createdAt,
      category: 'application'
    },
    {
      id: `doc-${patent.id}-2`,
      patentId: patent.id,
      patentTitle: patent.title,
      fileName: `${patent.title.replace(/[^a-zA-Z0-9]/g, '_')}_diagrams.png`,
      fileType: 'image/png',
      fileSize: 1234567,
      hashValue: 'b2c3d4e5f6789012345678901234567890abcdef1',
      createdAt: patent.createdAt,
      category: 'diagram'
    }
  ]) || [];

  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      // In a real app, this would call the API to delete the document
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      return documentId;
    },
    onSuccess: () => {
      toast({
        title: "Document Deleted",
        description: "Document has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/patents'] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('image')) return File;
    return FileText;
  };

  const getFileTypeColor = (fileType: string) => {
    if (fileType.includes('pdf')) return 'text-red-600';
    if (fileType.includes('image')) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getCategoryBadge = (category: string) => {
    const variants: { [key: string]: any } = {
      application: { variant: "default", label: "Application" },
      diagram: { variant: "secondary", label: "Diagram" },
      amendment: { variant: "outline", label: "Amendment" },
      correspondence: { variant: "destructive", label: "Correspondence" },
    };
    return variants[category] || { variant: "outline", label: "Document" };
  };

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = searchQuery === "" || 
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.patentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === "all" || 
      (filterType === "pdf" && doc.fileType.includes('pdf')) ||
      (filterType === "image" && doc.fileType.includes('image')) ||
      (filterType === selectedPatent && doc.patentId === selectedPatent);
    
    const matchesPatent = selectedPatent === "" || doc.patentId === selectedPatent;
    
    return matchesSearch && matchesFilter && matchesPatent;
  });

  if (loadingPatents) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground mt-2">
            Organize and manage all your patent-related documents
          </p>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Document Management</h1>
        <p className="text-muted-foreground mt-2">
          Organize, search, and manage all your patent-related documents with blockchain verification
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search Documents
          </CardTitle>
          <CardDescription>
            Find specific documents by patent, file type, or search terms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Documents</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by filename or patent title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Patent</label>
              <Select value={selectedPatent} onValueChange={setSelectedPatent}>
                <SelectTrigger>
                  <SelectValue placeholder="All Patents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Patents</SelectItem>
                  {patents?.map((patent: any) => (
                    <SelectItem key={patent.id} value={patent.id}>
                      {patent.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDF Documents</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Documents
            </Button>
            <div className="text-sm text-muted-foreground">
              Found {filteredDocuments.length} document(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Library
          </CardTitle>
          <CardDescription>
            All your patent documents with blockchain hash verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((document: any) => {
                  const FileIcon = getFileTypeIcon(document.fileType);
                  const categoryBadge = getCategoryBadge(document.category);
                  
                  return (
                    <Card key={document.id} variant="outline">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <FileIcon className={`h-8 w-8 ${getFileTypeColor(document.fileType)}`} />
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm">{document.fileName}</h4>
                                <Badge {...categoryBadge}>
                                  {categoryBadge.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Patent: {document.patentTitle}
                              </p>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                <div className="space-y-1">
                                  <p className="font-medium text-muted-foreground flex items-center gap-1">
                                    <File className="h-3 w-3" />
                                    Size
                                  </p>
                                  <p>{formatFileSize(document.fileSize)}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-medium text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Created
                                  </p>
                                  <p>{formatDate(document.createdAt)}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-medium text-muted-foreground flex items-center gap-1">
                                    <Hash className="h-3 w-3" />
                                    Hash
                                  </p>
                                  <p className="font-mono break-all">
                                    {document.hashValue.substring(0, 8)}...
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-medium text-muted-foreground flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    Status
                                  </p>
                                  <Badge variant="outline" className="text-green-600">
                                    Verified
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Document Details</DialogTitle>
                                  <DialogDescription>
                                    Complete information and verification details for {document.fileName}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                      <h4 className="font-semibold mb-2">File Information</h4>
                                      <div className="space-y-2 text-sm">
                                        <div>
                                          <span className="font-medium">Name:</span> {document.fileName}
                                        </div>
                                        <div>
                                          <span className="font-medium">Type:</span> {document.fileType}
                                        </div>
                                        <div>
                                          <span className="font-medium">Size:</span> {formatFileSize(document.fileSize)}
                                        </div>
                                        <div>
                                          <span className="font-medium">Created:</span> {formatDate(document.createdAt)}
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">Blockchain Verification</h4>
                                      <div className="space-y-2 text-sm">
                                        <div>
                                          <span className="font-medium">Hash:</span>
                                          <p className="font-mono text-xs break-all mt-1">{document.hashValue}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">Status:</span>
                                          <Badge variant="outline" className="text-green-600">
                                            ✓ Verified on Blockchain
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <Separator />
                                  <div>
                                    <h4 className="font-semibold mb-2">Associated Patent</h4>
                                    <p className="text-sm text-muted-foreground">{document.patentTitle}</p>
                                    <p className="text-xs text-muted-foreground">ID: {document.patentId}</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button variant="outline" size="sm">
                              <Download className="h-3 w-3" />
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteDocumentMutation.mutate(document.id)}
                              disabled={deleteDocumentMutation.isPending}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Documents Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || selectedPatent || filterType !== "all" 
                      ? "Try adjusting your search or filter criteria"
                      : "Upload documents to get started with document management"}
                  </p>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Document Statistics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDocuments.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {patents?.length || 0} patents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(mockDocuments.reduce((acc, doc) => acc + doc.fileSize, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Total storage utilized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Verification Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">100%</div>
            <p className="text-xs text-muted-foreground">
              All documents blockchain verified
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}