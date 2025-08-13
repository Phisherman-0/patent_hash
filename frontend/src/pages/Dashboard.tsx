import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Clock, 
  Shield, 
  TrendingUp,
  CheckCircle,
  Upload,
  Brain,
  DollarSign,
  Plus,
  Search,
  Edit3,
  Lightbulb,
  AlertTriangle,
  BarChart3,
  Eye,
  Download,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/dashboard/activities"],
    retry: false,
  });

  const { data: categoryStats, isLoading: categoryLoading } = useQuery({
    queryKey: ["/api/dashboard/category-stats"],
    retry: false,
  });

  if (statsLoading || activitiesLoading || categoryLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      medical_technology: 'bg-primary',
      software_ai: 'bg-blue-500',
      renewable_energy: 'bg-green-500',
      manufacturing: 'bg-purple-500',
      biotechnology: 'bg-pink-500',
      automotive: 'bg-yellow-500',
      telecommunications: 'bg-indigo-500',
      other: 'bg-gray-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const formatCategoryName = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
            <p className="text-orange-100 mb-4">
              {stats?.pendingReviews > 0 
                ? `You have ${stats.pendingReviews} patents pending review and new AI recommendations.`
                : "Your patent portfolio is up to date. Ready to file a new patent?"
              }
            </p>
            <Button className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              View All Updates
            </Button>
          </div>
          <div className="hidden md:block">
            <Lightbulb size={64} className="text-orange-200" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Patents</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalPatents || 0}</p>
                <p className="text-green-600 text-sm mt-1">
                  <TrendingUp size={14} className="inline mr-1" />
                  Growing strong
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.pendingReviews || 0}</p>
                <p className="text-yellow-600 text-sm mt-1">
                  <Clock size={14} className="inline mr-1" />
                  Avg. 14 days
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Blockchain Verified</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.blockchainVerified || 0}</p>
                <p className="text-green-600 text-sm mt-1">
                  <Shield size={14} className="inline mr-1" />
                  100% secure
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Portfolio Value</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${stats?.portfolioValue ? Number(stats.portfolioValue).toLocaleString() : '0'}
                </p>
                <p className="text-green-600 text-sm mt-1">
                  <TrendingUp size={14} className="inline mr-1" />
                  +15% growth
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-primary" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Patent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Patent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {activities && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.slice(0, 4).map((activity: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="text-green-600" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {activity.activityType} • {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {activity.activityType}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by filing your first patent.</p>
                <div className="mt-6">
                  <Button>
                    <Plus className="mr-2" size={16} />
                    File New Patent
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4 border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <Plus className="text-primary" size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">File New Patent</p>
                <p className="text-sm text-gray-500">Upload and submit new IP</p>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4 border border-gray-200 hover:border-primary hover:bg-primary/5"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Search className="text-blue-600" size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Prior Art Search</p>
                <p className="text-sm text-gray-500">AI-powered similarity check</p>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4 border border-gray-200 hover:border-primary hover:bg-primary/5"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Shield className="text-green-600" size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Verify Patent</p>
                <p className="text-sm text-gray-500">Blockchain verification</p>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4 border border-gray-200 hover:border-primary hover:bg-primary/5"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Edit3 className="text-purple-600" size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">AI Drafting</p>
                <p className="text-sm text-gray-500">Generate patent documents</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patent Categories Chart */}
        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle>Patent Categories</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {categoryStats && categoryStats.length > 0 ? (
              <div className="space-y-4">
                {categoryStats.map((category: any) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${getCategoryColor(category.category)}`}></div>
                      <span className="text-sm font-medium text-gray-700">
                        {formatCategoryName(category.category)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={category.percentage} className="w-32" />
                      <span className="text-sm font-medium text-gray-600 w-10">
                        {category.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No category data</h3>
                <p className="mt-1 text-sm text-gray-500">File patents to see category breakdown.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle>AI Insights</CardTitle>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Brain className="mr-1" size={12} />
                AI Powered
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="text-blue-600" size={16} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Innovation Opportunity</h4>
                  <p className="text-sm text-gray-700">
                    AI detected a gap in quantum computing patents for healthcare applications. 
                    Consider expanding your portfolio in this area.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="text-yellow-600" size={16} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Portfolio Health</h4>
                  <p className="text-sm text-gray-700">
                    Your patent portfolio shows strong diversity across technology sectors. 
                    Consider filing continuation patents for key innovations.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="text-green-600" size={16} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Portfolio Performance</h4>
                  <p className="text-sm text-gray-700">
                    Your patents show strong commercial potential. 
                    Consider licensing opportunities to maximize revenue.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
