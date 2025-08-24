"use client";

import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import "./Comment.scss";

export default function Comment({
  _id,
  author,
  content,
  isOwnComment,
  onUpdate,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  useEffect(() => {
    setEditContent(content);
  }, [content]);

  async function handleSave() {
    try {
      const res = await fetch(`/api/comments/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });
      if (!res.ok) throw new Error("Failed to update comment");
      const updatedComment = await res.json();
      setIsEditing(false);
      onUpdate(updatedComment);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`/api/comments/${_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete comment");
      onDelete(_id);
    } catch (err) {
      alert(err.message);
    }
  }

  function handleCancel() {
    setIsEditing(false);
    setEditContent(content);
  }

  if (isEditing) {
    return (
      <div className="comment-card editing">
        <div className="comment-avatar">
          <FaUserCircle size={30} />
        </div>
        <div className="comment-content">
          <p className="comment-author">{author || "Anonymous"}</p>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className="comment-actions">
            <button className="save-comment-btn" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-comment-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button className="delete-comment-btn" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="comment-card">
      <div className="comment-avatar">
        <FaUserCircle size={30} />
      </div>
      <div className="comment-content">
        <p className="comment-author">{author || "Anonymous"}</p>
        <p className="comment-text">{content}</p>
        {isOwnComment && (
          <div className="comment-actions">
            <button
              className="edit-comment-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="delete-comment-btn"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
