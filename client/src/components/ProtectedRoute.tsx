import { ReactNode } from "react";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { Loader2 } from "lucide-react";
import AuthPage from "@/pages/auth/AuthPage";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isInitialized, isLoading } = useAppSelector((state) => state.auth);

  // Show loading spinner while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Patent Hash...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!user) {
    return <AuthPage />;
  }

  // Show protected content if authenticated
  return <>{children}</>;
}