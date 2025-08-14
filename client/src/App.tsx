import { useEffect } from "react";
import { Router, Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { initializeAuth } from "@/store/authSlice";
import Layout from "@/components/layout/Layout";

// Import pages
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Analytics from "@/pages/Analytics";

// Patents
import FilePatent from "@/pages/patents/FilePatent";
import MyPatents from "@/pages/patents/MyPatents";
import StatusTracking from "@/pages/patents/StatusTracking";
import PatentValuation from "@/pages/patents/PatentValuation";
import DocumentManagement from "@/pages/patents/DocumentManagement";
import DraftingAssistant from "@/pages/patents/DraftingAssistant";
import QuickVerification from "@/pages/patents/QuickVerification";

// AI Features
import PriorArtSearch from "@/pages/ai/PriorArtSearch";
import SimilarityDetection from "@/pages/ai/SimilarityDetection";
import Classification from "@/pages/ai/Classification";
import PatentAnalytics from "@/pages/ai/PatentAnalytics";

// Verification
import BlockchainVerification from "@/pages/verification/BlockchainVerification";
import OwnershipVerification from "@/pages/verification/OwnershipVerification";
import PatentCertificates from "@/pages/verification/PatentCertificates";

import NotFound from "@/pages/not-found";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <div className="App">
      <ProtectedRoute>
        <Router>
          <Layout>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/profile" component={Profile} />
              <Route path="/settings" component={Settings} />
              <Route path="/analytics" component={Analytics} />
              
              {/* Patents Routes */}
              <Route path="/patents/file" component={FilePatent} />
              <Route path="/patents/my-patents" component={MyPatents} />
              <Route path="/patents/status" component={StatusTracking} />
              <Route path="/patents/valuation" component={PatentValuation} />
              <Route path="/patents/documents" component={DocumentManagement} />
              <Route path="/patents/drafting" component={DraftingAssistant} />
              <Route path="/patents/quick-verify" component={QuickVerification} />
              
              {/* AI Features Routes */}
              <Route path="/ai/prior-art" component={PriorArtSearch} />
              <Route path="/ai/similarity" component={SimilarityDetection} />
              <Route path="/ai/classification" component={Classification} />
              <Route path="/ai/analytics" component={PatentAnalytics} />
              
              {/* Verification Routes */}
              <Route path="/verification/blockchain" component={BlockchainVerification} />
              <Route path="/verification/ownership" component={OwnershipVerification} />
              <Route path="/verification/certificates" component={PatentCertificates} />
              
              {/* Fallback */}
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </Router>
      </ProtectedRoute>
      <Toaster />
    </div>
  );
}

export default App;