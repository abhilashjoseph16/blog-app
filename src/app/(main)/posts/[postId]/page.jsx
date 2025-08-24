"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/components/Loading";
import Comment from "@/components/Comment";
import "./PostDetailsPage.scss";
import ErrorPage from "@/components/ErrorPage";
import { FaCommentDots } from "react-icons/fa";

export default function PostDetailsPage() {
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [commentsVisible, setCommentsVisible] = useState(false);
  const router = useRouter();
  const { postId } = useParams();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/user", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${postId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load post");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchPost();
  }, [postId]);

  if (!post) return <Loading message="Loading post..." />;
  if (error) return <p>Error: {error}</p>;

  const userHasEditAccess =
    user && (post.author._id === user._id || user.role === "admin");

  function handleCommentUpdate(updatedComment) {
    setPost((prevPost) => {
      const updatedComments = prevPost.comments.map((c) =>
        c._id === updatedComment._id
          ? { ...updatedComment, author: c.author }
          : c
      );
      return { ...prevPost, comments: updatedComments };
    });
  }

  function handleCommentDelete(commentId) {
    setPost((prevPost) => {
      const updatedComments = prevPost.comments.filter(
        (c) => c._id !== commentId
      );
      return { ...prevPost, comments: updatedComments };
    });
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment }),
    });

    if (res.ok) {
      setComment("");
      const postRes = await fetch(`/api/posts/${postId}`, {
        credentials: "include",
      });
      if (postRes.ok) {
        const data = await postRes.json();
        setPost(data);
      }
    } else {
      alert("Failed to add comment");
    }
  }

  async function handleDeletePost() {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete post");
      router.push("/home");
    } catch (err) {
      return <ErrorPage message={err.message} />;
    }
  }

  return (
    <div className="post-details-page">
      <div className="post-details-container">
        <div className="post-card">
          <div className="post-header">
            <p className="post-author">@{post.author.name}</p>
            {userHasEditAccess && (
              <div className="post-actions">
                <button
                  className="edit-btn"
                  onClick={() => router.push(`/posts/${postId}/edit`)}
                >
                  Edit
                </button>
                <button className="delete-btn" onClick={handleDeletePost}>
                  Delete
                </button>
              </div>
            )}
          </div>

          <h2 className="post-title">{post.title}</h2>
          <p className="post-content">{post.content}</p>

          <div className="comments-toggle">
            <button
              className="toggle-comments-btn"
              onClick={() => setCommentsVisible((prev) => !prev)}
            >
              <FaCommentDots /> {post.comments?.length || 0} Comments
            </button>
          </div>

          {commentsVisible && (
            <div className="comments-section">
              <div className="comments-list">
                {post.comments?.length ? (
                  post.comments.map((c) => (
                    <Comment
                      key={c._id}
                      _id={c._id}
                      author={c.author?.name}
                      content={c.content}
                      isOwnComment={
                        user &&
                        c.author &&
                        (String(user._id) === String(c.author._id) ||
                          user.role === "admin")
                      }
                      onUpdate={handleCommentUpdate}
                      onDelete={handleCommentDelete}
                    />
                  ))
                ) : (
                  <p className="no-comments">No comments yet</p>
                )}
              </div>

              <form className="add-comment-form" onSubmit={handleAddComment}>
                <textarea
                  className="comment-input"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                />
                <button type="submit" className="comment-btn">
                  Post
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
