"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/components/Loading";
import EditPost from "@/components/EditPost";
import "./EditPostPage.scss";
import ErrorPage from "@/components/ErrorPage";

export default function EditPostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${postId}`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load post");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [postId]);

  async function handleSave(updated) {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Failed to save changes");
      router.push(`/posts/${postId}`);
    } catch (err) {
      <ErrorPage message={err.message}/>
    }
  }

  function handleCancel() {
    router.push(`/posts/${postId}`);
  }

  if (loading) return <Loading message="Loading post..." />;
  if (error) return <p className="edit-error">Error: {error}</p>;

  return (
    <div className="edit-post-page">
      <div className="edit-post-container">
        <h2 className="edit-page-title">Edit Post</h2>
        <EditPost post={post} onSave={handleSave} onCancel={handleCancel} />
      </div>
    </div>
  );
}
