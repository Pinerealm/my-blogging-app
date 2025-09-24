"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";

import ProtectedRoute from "../../../../components/ProtectedRoute";
import { postSchema } from "../../../../lib/validations";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Alert } from "../../../../components/ui/Alert";
import api from "../../../../lib/auth";
import { useAuthStore } from "../../../../store/auth";

function EditPostContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [post, setPost] = useState(null);

  const postId = params.id;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const watchedTitle = watch("title");

  // Fetch the existing post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        setFetchingPost(true);
        const response = await api.get(`/posts/${postId}`);
        const postData = response.data;

        // Check if the current user is the author
        if (user && postData.author_id !== user.id) {
          setError("You are not authorized to edit this post");
          return;
        }

        setPost(postData);
        setValue("title", postData.title || "");
        setValue("content", postData.content || "");
      } catch (error) {
        console.error("Error fetching post:", error);
        if (error.response?.status === 404) {
          setError("Post not found");
        } else if (error.response?.status === 403) {
          setError("You are not authorized to edit this post");
        } else {
          setError("Failed to load post");
        }
      } finally {
        setFetchingPost(false);
      }
    };

    if (user) {
      fetchPost();
    }
  }, [postId, user, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.put(`/posts/${postId}`, data);
      setSuccess(true);

      // Redirect to the post detail page after a short delay
      setTimeout(() => {
        router.push(`/posts/${postId}`);
      }, 1500);
    } catch (error) {
      console.error("Error updating post:", error);
      if (error.response?.status === 403) {
        setError("You are not authorized to edit this post");
      } else {
        setError(
          error.response?.data?.detail ||
            "Failed to update post. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    const formData = watch();
    if (!formData.title && !formData.content) {
      setError("Please add some content before saving draft");
      return;
    }

    // For now, we'll just save as a regular post update
    // In the future, this could save to a drafts endpoint or add a draft status
    setError("Draft functionality will be implemented in a future update");
  };

  // Show loading while fetching post
  if (fetchingPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error if post couldn't be loaded or user is not authorized
  if (error && !post) {
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href={`/posts/${postId}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Post
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
        <p className="mt-2 text-gray-600">
          Update your post content and publish changes
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <Alert variant="success" className="mb-6">
          Post updated successfully! Redirecting to post...
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Post Title
          </label>
          <Input
            id="title"
            type="text"
            placeholder="Enter your post title..."
            {...register("title")}
            error={errors.title?.message}
            className="text-lg"
          />
          <div className="mt-1 text-sm text-gray-500">
            {watchedTitle?.length || 0}/200 characters
          </div>
        </div>

        {/* Content Textarea */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Post Content
          </label>
          <textarea
            id="content"
            rows={12}
            placeholder="Write your post content here..."
            {...register("content")}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm resize-y
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${
                errors.content
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }
            `}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="inline-flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/posts/${postId}`}>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isLoading || !isDirty}
              className="inline-flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Update Post
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Editing Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            • Make sure your title clearly represents your updated content
          </li>
          <li>• Review your changes before updating to ensure accuracy</li>
          <li>
            • Consider how changes might affect readers who already engaged with
            this post
          </li>
          <li>• Your post URL and creation date will remain the same</li>
        </ul>
      </div>
    </div>
  );
}

export default function EditPostPage() {
  return (
    <ProtectedRoute>
      <EditPostContent />
    </ProtectedRoute>
  );
}
