"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./CreatePostPage.scss";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      router.push("/home");
    } else {
      const { message } = await res.json();
      setError(message || "Failed to create post");
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h2 className="create-post-title">Create New Post</h2>
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              placeholder="Post content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="textarea-field"
            />
          </div>
          <button type="submit" className="submit-btn">Create Post</button>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
}
