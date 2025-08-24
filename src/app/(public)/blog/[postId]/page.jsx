"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/ErrorPage";
import "./BlogPostPage.scss";

export default function BlogPostPage() {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/posts/${postId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading) return <Loading message="Loading post..." />;
  if (error) return <ErrorPage message={`Error: ${error}`} />;
  if (!post) return <ErrorPage message="Post not found" />;

  return (
    <div className="blog-post-page">
      <div className="blog-post-container">
        <article className="blog-post-card">
          <div className="blog-post-header">
            <p className="blog-post-author">By @{post.author?.name || "Unknown"}</p>
          </div>
          <h1 className="blog-post-title">{post.title}</h1>
          <div className="blog-post-content">{post.content}</div>
        </article>
      </div>
    </div>
  );
}
