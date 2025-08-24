"use client";

import { useState, useEffect } from "react";
import "./ProfilePage.scss";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/ErrorPage";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/auth/user", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: password || undefined }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updatedUser = await res.json();
      setUser(updatedUser);
      setPassword("");
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Loading message="Fetching profile..." />;
  }

  if (error || !user) {
    return <ErrorPage message={error || "User not found"} />;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{user.name.charAt(0)}</div>
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-email">{user.email}</p>
        </div>

        <form className="profile-form" onSubmit={handleSave}>
          <label className="profile-label">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
              required
              className="profile-input"
            />
          </label>

          <label className="profile-label">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={saving}
              required
              className="profile-input"
            />
          </label>

          <label className="profile-label">
            Password (leave blank to keep current)
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={saving}
              className="profile-input"
              placeholder="New password"
            />
          </label>

          <button type="submit" className="profile-save-btn" disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>

          {success && <p className="profile-success-message">{success}</p>}
        </form>
      </div>
    </div>
  );
}
