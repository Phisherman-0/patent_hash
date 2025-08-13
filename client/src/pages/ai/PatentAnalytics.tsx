import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, TrendingUp, Target, Shield, Lightbulb, BarChart3, PieChart, Activity, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { useState } from "react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function PatentAnalytics() {
  const [selectedPatent, setSelectedPatent] = useState<string>("");
  const [analysisType, setAnalysisType] = useState<string>("comprehensive");

  const { data: patents, isLoading: loadingPatents } = useQuery({
    queryKey: ['/api/patents'],
  });

  const { data: userStats, isLoading: loadingStats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: categoryStats, isLoading: loadingCategories } = useQuery({
    queryKey: ['/api/dashboard/category-stats'],
  });

  // Mock AI analytics data - in real implementation, this would come from AI analysis
  const mockAnalytics = {
    portfolioStrength: {
      score: 8.2,
      factors: {
        diversity: 7.8,
        marketRelevance: 8.5,
        technicalNovelty: 8.9,
        commercialPotential: 7.6,
      }
    },
    trendAnalysis: [
      { month: 'Jan', filings: 2, strength: 7.2 },
      { month: 'Feb', filings: 3, strength: 7.8 },
      { month: 'Mar', filings: 1, strength: 8.1 },
      { month: 'Apr', filings: 4, strength: 8.3 },
      { month: 'May', filings: 2, strength: 8.2 },
      { month: 'Jun', filings: 3, strength: 8.5 },
    ],
    competitiveAnalysis: {
      position: "Strong",
      marketShare: 12.5,
      competitors: [
        { name: "Company A", patents: 45, strength: 7.8 },
        { name: "Company B", patents: 38, strength: 7.2 },
        { name: "Company C", patents: 52, strength: 8.1 },
        { name: "Your Position", patents: patents?.length || 15, strength: 8.2 },
      ]
    },
    riskAssessment: [
      { category: "Patent Expiration", risk: 25, impact: "Medium" },
      { category: "Prior Art Conflicts", risk: 15, impact: "High" },
      { category: "Market Competition", risk: 60, impact: "Medium" },
      { category: "Technology Obsolescence", risk: 30, impact: "Low" },
    ],
    recommendations: [
      {
        type: "filing_strategy",
        priority: "High",
        title: "Expand Medical Technology Portfolio",
        description: "Consider filing additional patents in medical technology sector based on high market growth predictions.",
        impact: "Portfolio diversification and market positioning"
      },
      {
        type: "commercialization",
        priority: "Medium", 
        title: "Accelerate AI Patent Licensing",
        description: "Current AI patents show strong commercial potential. Consider licensing strategies to monetize innovations.",
        impact: "Revenue generation and market penetration"
      },
      {
        type: "protection",
        priority: "High",
        title: "Strengthen Core Technology Claims",
        description: "Some patents have broad claims that may be vulnerable. Consider filing continuation patents with narrower, stronger claims.",
        impact: "Enhanced legal protection and enforceability"
      }
    ],
    valuationTrends: [
      { category: 'Medical Tech', value: 450000, growth: 12.5 },
      { category: 'AI/Software', value: 380000, growth: 18.2 },
      { category: 'Manufacturing', value: 320000, growth: 8.1 },
      { category: 'Energy', value: 290000, growth: 15.3 },
    ]
  };

  const getStrengthColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "outline";
    }
  };

  if (loadingPatents || loadingStats || loadingCategories) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Patent Analytics</h1>
          <p className="text-muted-foreground mt-2">
            AI-powered insights and analytics for your patent portfolio
          </p>
        </div>
        <div className="grid gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-96" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patent Analytics</h1>
          <p className="text-muted-foreground mt-2">
            AI-powered comprehensive analytics, market insights, and strategic recommendations for your patent portfolio
          </p>
        </div>
        <Button>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Analytics
        </Button>
      </div>

      {/* Portfolio Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Portfolio Strength</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {mockAnalytics.portfolioStrength.score}/10
              </div>
              <Progress value={mockAnalytics.portfolioStrength.score * 10} className="h-2" />
              <p className="text-xs text-muted-foreground">AI-calculated portfolio strength</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Market Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{mockAnalytics.competitiveAnalysis.position}</div>
              <Badge variant="secondary">
                {mockAnalytics.competitiveAnalysis.marketShare}% share
              </Badge>
              <p className="text-xs text-muted-foreground">Competitive positioning</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                ${mockAnalytics.valuationTrends.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs">+13.2% avg growth</span>
              </div>
              <p className="text-xs text-muted-foreground">AI-estimated value</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-yellow-600">Medium</div>
              <Badge variant="outline">3 areas flagged</Badge>
              <p className="text-xs text-muted-foreground">Overall portfolio risk</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="competitive">Competitive</TabsTrigger>
          <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Portfolio Strength Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Portfolio Strength Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(mockAnalytics.portfolioStrength.factors).map(([factor, score]) => (
                    <div key={factor} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium capitalize">
                          {factor.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className={`font-semibold ${getStrengthColor(score)}`}>
                          {score}/10
                        </span>
                      </div>
                      <Progress value={score * 10} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Technology Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                {categoryStats && categoryStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryStats}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                      >
                        {categoryStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No category data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Valuation by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Portfolio Valuation by Category
              </CardTitle>
              <CardDescription>
                AI-estimated market value and growth trends by technology sector
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockAnalytics.valuationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}K`} />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'value' ? `$${value.toLocaleString()}` : `${value}%`,
                      name === 'value' ? 'Portfolio Value' : 'Growth Rate'
                    ]}
                  />
                  <Bar dataKey="value" fill="#8884d8" />
                  <Bar dataKey="growth" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Filing Trends & Portfolio Strength
              </CardTitle>
              <CardDescription>
                Track your patent filing activity and portfolio strength over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mockAnalytics.trendAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="filings" fill="#8884d8" />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="strength" 
                    stroke="#82ca9d" 
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Competitive Landscape Analysis
              </CardTitle>
              <CardDescription>
                Your position relative to key competitors in the market
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.competitiveAnalysis.competitors.map((competitor, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`font-medium ${competitor.name === 'Your Position' ? 'text-primary' : ''}`}>
                          {competitor.name}
                        </span>
                        {competitor.name === 'Your Position' && (
                          <Badge variant="default">You</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {competitor.patents} patents
                        </span>
                        <span className={`font-semibold ${getStrengthColor(competitor.strength)}`}>
                          {competitor.strength}/10
                        </span>
                      </div>
                    </div>
                    <Progress value={competitor.strength * 10} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Risk Assessment
              </CardTitle>
              <CardDescription>
                Identified risks and potential impacts on your patent portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.riskAssessment.map((risk, index) => (
                  <Card key={index} variant="outline">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{risk.category}</h4>
                          <Badge 
                            variant={
                              risk.impact === "High" ? "destructive" : 
                              risk.impact === "Medium" ? "default" : "secondary"
                            }
                          >
                            {risk.impact} Impact
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Risk Level</span>
                            <span className="font-medium">{risk.risk}%</span>
                          </div>
                          <Progress value={risk.risk} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid gap-6">
            {mockAnalytics.recommendations.map((rec, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Lightbulb className="h-4 w-4" />
                      {rec.title}
                    </CardTitle>
                    <Badge variant={getPriorityColor(rec.priority) as any}>
                      {rec.priority} Priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {rec.description}
                    </p>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Expected Impact:
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {rec.impact}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Implement</Button>
                      <Button variant="outline" size="sm">Learn More</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}