"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { authAPI } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

export default function AuthorPage() {
  const params = useParams();
  const router = useRouter();
  const { username } = params;

  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (username) {
      loadAuthorData();
    }
  }, [username]);

  const loadAuthorData = async () => {
    try {
      const [authorData, postsData, statsData] = await Promise.all([
        authAPI.getUserByUsername(username),
        authAPI.getUserPosts(username, 0, 10),
        authAPI.getUserStats(username),
      ]);

      setAuthor(authorData);
      setPosts(postsData);
      setStats(statsData);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Author not found");
      } else {
        setError("Failed to load author information");
      }
      console.error("Author load error:", err);
    } finally {
      setLoading(false);
      setPostsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">Loading author profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Alert type="error" message={error} />
          <div className="text-center mt-6">
            <Button onClick={() => router.push("/")} variant="outline">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Author Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {author.avatar_url ? (
                <img
                  src={author.avatar_url}
                  alt={`${author.username}'s avatar`}
                  className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center border-4 border-gray-200">
                  <span className="text-2xl font-bold text-gray-600">
                    {author.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Author Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {author.first_name && author.last_name
                    ? `${author.first_name} ${author.last_name}`
                    : author.username}
                </h1>
                <span className="text-lg text-gray-600">
                  @{author.username}
                </span>
              </div>

              {author.bio && (
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {author.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">
                {author.location && (
                  <div className="flex items-center gap-1">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {author.location}
                  </div>
                )}

                {author.website && (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    Website
                  </a>
                )}

                <div className="flex items-center gap-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Joined {stats && formatJoinDate(stats.joined_date)}
                </div>
              </div>

              {/* Stats */}
              {stats && (
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900">
                      {stats.total_posts}
                    </span>
                    <span className="text-gray-600 ml-1">
                      {stats.total_posts === 1 ? "Post" : "Posts"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Posts
          </h2>

          {postsLoading ? (
            <div className="text-center py-8">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>This author hasn't published any posts yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <button
                      onClick={() => router.push(`/posts/${post.id}`)}
                      className="hover:text-blue-600 transition-colors text-left"
                    >
                      {post.title}
                    </button>
                  </h3>

                  <p className="text-gray-600 mb-3 line-clamp-3 leading-relaxed">
                    {post.content.substring(0, 200)}
                    {post.content.length > 200 && "..."}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <time>{formatDate(post.created_at)}</time>
                    <Button
                      onClick={() => router.push(`/posts/${post.id}`)}
                      variant="outline"
                      size="sm"
                    >
                      Read More
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
