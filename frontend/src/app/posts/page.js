"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import api from "../../lib/auth";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data);
      } catch (error) {
        setError("Failed to load posts");
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Posts</h1>
        <p className="text-gray-600">
          Discover amazing stories and insights from our community of writers.
        </p>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <User className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-500 mb-6">
            Be the first to share your story with the community.
          </p>
          <Link href="/auth/register">
            <Button>Join and start writing</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
                    <Link href={`/posts/${post.id}`}>
                      {post.title || "Untitled"}
                    </Link>
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content
                      ? post.content.length > 150
                        ? `${post.content.substring(0, 150)}...`
                        : post.content
                      : "No content available"}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>
                        {post.author
                          ? post.author.username
                          : `Author ID: ${post.author_id}`}
                      </span>
                    </div>
                    {post.created_at && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Link href={`/posts/${post.id}`}>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
