"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "./HomePage.scss";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/ErrorPage";
import Pagination from "@/components/Pagination";
import Link from "next/link";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1");
  const titleQuery = searchParams.get("title") || "";
  const limit = 10;

  useEffect(() => {
    setSearchInput(titleQuery);
  }, [titleQuery]);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (titleQuery) {
          params.append("title", titleQuery);
        }

        const res = await fetch(`/api/posts?${params.toString()}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data.posts);
        setTotalPages(data.pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [page, titleQuery]);

  function handlePageChange(newPage) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", newPage.toString());
    router.push(`/home?${params.toString()}`);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (searchInput) {
      params.set("title", searchInput);
    } else {
      params.delete("title");
    }
    params.set("page", "1");
    router.push(`/home?${params.toString()}`);
  }

  if (loading) {
    return <Loading message="Fetching posts.." />;
  }
  if (error) {
    return <ErrorPage message={`Error: ${error}`} />;
  }

  if (posts.length === 0) {
    return <ErrorPage message="No posts available" />;
  }

  return (
    <div className="home-page-container">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search posts by title..."
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>
      <div className="home-posts-list">
        {posts.map(({ _id, title, content, author }) => (
          <Link
            key={_id}
            href={`/posts/${_id}`}
            className="home-post-card-link"
          >
            <div className="home-post-card">
              <h2 className="post-title">{title}</h2>
              <p className="post-author">@{author?.name || "Unknown"}</p>
              <p className="post-content">{content.substring(0, 200)}...</p>
            </div>
          </Link>
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
