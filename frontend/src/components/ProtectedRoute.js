"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, initializeAuth, isLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      setIsInitialized(true);
    };
    init();
  }, [initializeAuth]);

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated()) {
      router.push("/auth/login");
    }
  }, [isInitialized, isLoading, isAuthenticated, router]);

  // Show loading while initializing auth
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated()) {
    return null;
  }

  return children;
}
