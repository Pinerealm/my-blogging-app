"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, PenSquare, BookOpen } from "lucide-react";

import { useAuthStore } from "../store/auth";
import { Button } from "./ui/Button";

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BlogHub</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/posts"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Explore
            </Link>
            {isAuthenticated() && (
              <Link
                href="/posts/new"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Write
              </Link>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                <Link href="/posts/new">
                  <Button size="sm" className="hidden sm:flex">
                    <PenSquare className="h-4 w-4 mr-2" />
                    Write
                  </Button>
                </Link>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {user?.username || user?.email}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Get started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
