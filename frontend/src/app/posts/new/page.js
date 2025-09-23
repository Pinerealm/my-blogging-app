"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";

import ProtectedRoute from "../../../components/ProtectedRoute";
import { postSchema } from "../../../lib/validations";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Alert } from "../../../components/ui/Alert";
import api from "../../../lib/auth";

function NewPostContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const watchedTitle = watch("title");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.post("/posts", data);
      setSuccess(true);

      // Redirect to the created post or posts list after a short delay
      setTimeout(() => {
        router.push("/posts");
      }, 1500);
    } catch (error) {
      console.error("Error creating post:", error);
      setError(
        error.response?.data?.detail ||
          "Failed to create post. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    // For now, we'll just save as a regular post
    // In the future, this could save to a drafts endpoint
    const formData = watch();
    if (!formData.title && !formData.content) {
      setError("Please add some content before saving draft");
      return;
    }

    // This is a placeholder for draft functionality
    setError("Draft functionality will be implemented in a future update");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
        <p className="mt-2 text-gray-600">
          Share your thoughts and ideas with the community
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <Alert variant="success" className="mb-6">
          Post created successfully! Redirecting to posts...
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
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isDirty}
              className="inline-flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Publish Post
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Writing Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Use a clear, descriptive title that captures your main idea</li>
          <li>
            • Break up long content with paragraphs for better readability
          </li>
          <li>• Consider your audience and write in a conversational tone</li>
          <li>• Preview your post before publishing to check formatting</li>
        </ul>
      </div>
    </div>
  );
}

export default function NewPostPage() {
  return (
    <ProtectedRoute>
      <NewPostContent />
    </ProtectedRoute>
  );
}
