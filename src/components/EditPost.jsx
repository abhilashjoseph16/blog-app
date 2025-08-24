"use client";

import { useState } from "react";
import "./EditPost.scss";

export default function EditPost({ post, onSave, onCancel }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("Failed to save post");

      const updatedPost = await res.json();
      onSave(updatedPost);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="edit-post-form">
      <h1>Edit Post</h1>
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        disabled={saving}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
        disabled={saving}
      />
      <div className="edit-post-buttons">
        <button type="submit" disabled={saving} className="save-btn">
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="cancel-btn"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
