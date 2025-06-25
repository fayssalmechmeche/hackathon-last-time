import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { authApi } from "../lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await authApi.getProfile();
        setIsAuthenticated(true);
      } catch {
        // If profile fetch fails, token is invalid
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Still checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-lg text-foreground">Chargement...</div>
        </div>
      </div>
    );
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated, render children
  return <>{children}</>;
}
