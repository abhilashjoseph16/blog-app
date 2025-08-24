"use client";

import React, { useEffect, useState } from "react";
import "./Login.scss";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/home";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (token && typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Login failed");
      }

      const data = await res.json();

      if (data.token) {
        setToken(data.token);
      }

      setTimeout(() => {
        router.push(redirectTo);
      }, 100);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page-main-container">
      <div className="login-page_card">
        <div className="login-page_title">
          <h2>Sign In</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <button type="submit" className="btn">
            Sign In
          </button>
        </form>
        <p className="register-link">
          Don’t have an account?{" "}
          <Link href="/register" className="register-link-btn">
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
