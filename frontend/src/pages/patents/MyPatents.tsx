import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  MoreHorizontal,
  Calendar,
  DollarSign,
  Shield,
  Brain,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import { Link } from "wouter";

interface Patent {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  patentNumber?: string;
  estimatedValue?: string;
  filedAt?: string;
  approvedAt?: string;
  expiresAt?: string;
  hederaTopicId?: string;
  hederaNftId?: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  under_review: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  expired: "bg-gray-100 text-gray-600",
};

const categoryIcons: Record<string, React.ComponentType<any>> = {
  medical_technology: FileText,
  software_ai: Brain,
  renewable_energy: Shield,
  manufacturing: FileText,
  biotechnology: FileText,
  automotive: FileText,
  telecommunications: FileText,
  other: FileText,
};

export default function MyPatents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: patents, isLoading: patentsLoading, error } = useQuery({
    queryKey: ["/api/patents"],
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (patentId: string) => {
      await apiRequest("DELETE", `/api/patents/${patentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Patent deleted",
        description: "The patent has been successfully deleted.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error deleting patent",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatCategoryName = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatStatusName = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatCurrency = (value?: string) => {
    if (!value) return "Not valued";
    return `$${Number(value).toLocaleString()}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const filteredPatents = patents?.filter((patent: Patent) => {
    const matchesSearch = patent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || patent.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || patent.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  if (patentsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading patents</h3>
        <p className="mt-1 text-sm text-gray-500">There was an error loading your patents. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Patents</h1>
          <p className="text-gray-600 mt-2">
            Manage and track your intellectual property portfolio
          </p>
        </div>
        <Link href="/patents/file">
          <Button className="mt-4 sm:mt-0 bg-primary hover:bg-primary-dark">
            <Plus className="mr-2" size={16} />
            File New Patent
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search patents by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="medical_technology">Medical Technology</SelectItem>
                <SelectItem value="software_ai">Software & AI</SelectItem>
                <SelectItem value="renewable_energy">Renewable Energy</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="biotechnology">Biotechnology</SelectItem>
                <SelectItem value="automotive">Automotive</SelectItem>
                <SelectItem value="telecommunications">Telecommunications</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patents Table */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle>Patents ({filteredPatents.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2" size={16} />
                More Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredPatents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No patents found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {patents && patents.length === 0 
                  ? "Get started by filing your first patent."
                  : "Try adjusting your search criteria."
                }
              </p>
              {patents && patents.length === 0 && (
                <div className="mt-6">
                  <Link href="/patents/file">
                    <Button>
                      <Plus className="mr-2" size={16} />
                      File New Patent
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Filed Date</TableHead>
                    <TableHead>Blockchain</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatents.map((patent: Patent) => {
                    const CategoryIcon = categoryIcons[patent.category] || FileText;
                    
                    return (
                      <TableRow key={patent.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <CategoryIcon className="text-primary" size={20} />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {patent.title}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {patent.patentNumber || `ID: ${patent.id.slice(0, 8)}...`}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[patent.status] || statusColors.draft}>
                            {formatStatusName(patent.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-900">
                          {formatCategoryName(patent.category)}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-gray-900">
                          {formatCurrency(patent.estimatedValue)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(patent.filedAt || patent.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {patent.hederaTopicId && (
                              <Shield className="text-green-600" size={16} />
                            )}
                            {patent.hederaNftId && (
                              <Badge variant="secondary" className="text-xs">NFT</Badge>
                            )}
                            {!patent.hederaTopicId && (
                              <span className="text-gray-400 text-xs">Not secured</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye size={16} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteMutation.mutate(patent.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
