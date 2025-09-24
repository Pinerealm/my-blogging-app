"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Edit2, Trash2 } from "lucide-react";
import api from "../../../lib/auth";
import { Button } from "../../../components/ui/Button";
import { Alert } from "../../../components/ui/Alert";
import { useAuthStore } from "../../../store/auth";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const postId = params.id;

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        setLoading(true);
        const response = await api.get(`/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        if (error.response?.status === 404) {
          setError("Post not found");
        } else {
          setError("Failed to load post");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleDeletePost = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await api.delete(`/posts/${postId}`);
      router.push("/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete post. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
        <div className="text-center">
          <Link href="/posts">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show post not found
  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Post Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/posts">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = isAuthenticated() && user && user.id === post.author_id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Navigation */}
      <div className="mb-8">
        <Link
          href="/posts"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Posts
        </Link>
      </div>

      {/* Post Content */}
      <article className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Post Header */}
        <div className="px-6 py-8 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {post.title || "Untitled"}
              </h1>

              {/* Post Meta */}
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {post.author ? (
                    <Link
                      href={`/author/${post.author.username}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {post.author.username}
                    </Link>
                  ) : (
                    <span>Unknown Author</span>
                  )}
                </div>
                {post.created_at && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Author Actions */}
            {isAuthor && (
              <div className="flex items-center space-x-2 ml-6">
                <Link href={`/posts/${post.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeletePost}
                  disabled={deleting}
                  className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Post Body */}
        <div className="px-6 py-8">
          <div className="prose prose-lg max-w-none">
            {post.content ? (
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {post.content}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No content available for this post.
              </p>
            )}
          </div>
        </div>

        {/* Post Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Published on{" "}
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            {/* Future: Add engagement metrics here (likes, comments, shares) */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {/* Placeholder for future features */}
            </div>
          </div>
        </div>
      </article>

      {/* Navigation */}
      <div className="mt-8 flex justify-center">
        <Link href="/posts">
          <Button variant="outline">View More Posts</Button>
        </Link>
      </div>

      {/* Future: Comments section will go here */}
      <div className="mt-12">
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Comments Coming Soon
          </h3>
          <p className="text-gray-600">
            We're working on adding a comment system to help you engage with
            posts.
          </p>
        </div>
      </div>
    </div>
  );
}
