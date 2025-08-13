import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import FilePatent from "@/pages/patents/FilePatent";
import MyPatents from "@/pages/patents/MyPatents";
import PatentValuation from "@/pages/patents/PatentValuation";
import DraftingAssistant from "@/pages/patents/DraftingAssistant";
import QuickVerification from "@/pages/patents/QuickVerification";
import StatusTracking from "@/pages/patents/StatusTracking";
import DocumentManagement from "@/pages/patents/DocumentManagement";
import PriorArtSearch from "@/pages/ai/PriorArtSearch";
import SimilarityDetection from "@/pages/ai/SimilarityDetection";
import Classification from "@/pages/ai/Classification";
import PatentAnalytics from "@/pages/ai/PatentAnalytics";
import BlockchainVerification from "@/pages/verification/BlockchainVerification";
import OwnershipVerification from "@/pages/verification/OwnershipVerification";
import PatentCertificates from "@/pages/verification/PatentCertificates";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <Layout>
          <Route path="/" component={Dashboard} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/patents/file" component={FilePatent} />
          <Route path="/patents/my-patents" component={MyPatents} />
          <Route path="/patents/valuation" component={PatentValuation} />
          <Route path="/patents/drafting" component={DraftingAssistant} />
          <Route path="/patents/verify" component={QuickVerification} />
          <Route path="/patents/status" component={StatusTracking} />
          <Route path="/patents/documents" component={DocumentManagement} />
          <Route path="/ai/prior-art-search" component={PriorArtSearch} />
          <Route path="/ai/similarity" component={SimilarityDetection} />
          <Route path="/ai/classification" component={Classification} />
          <Route path="/ai/analytics" component={PatentAnalytics} />
          <Route path="/verification/blockchain" component={BlockchainVerification} />
          <Route path="/verification/ownership" component={OwnershipVerification} />
          <Route path="/verification/certificates" component={PatentCertificates} />
          <Route path="/profile" component={Profile} />
          <Route path="/settings" component={Settings} />
        </Layout>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
