"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/ErrorPage";
import Pagination from "@/components/Pagination";
import "./BlogPage.scss";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1");
  const titleQuery = searchParams.get("title") || "";
  const limit = 10;

  const [searchInput, setSearchInput] = useState(titleQuery);

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
    router.push(`/blog?${params.toString()}`);
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
    router.push(`/blog?${params.toString()}`);
  }

  if (loading) {
    return <Loading message="Fetching posts..." />;
  }

  if (error) {
    return <ErrorPage message={`Error: ${error}`} />;
  }

  if (posts.length === 0) {
    return <ErrorPage message="No posts available" />;
  }

  return (
    <div className="blog-page">
      <form onSubmit={handleSearchSubmit} className="blog-search">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search posts by title..."
          className="blog-search-input"
        />
        <button type="submit" className="blog-search-btn">
          Search
        </button>
      </form>

      <div className="blog-posts">
        {posts.map(({ _id, title, content, author }) => (
          <Link key={_id} href={`/blog/${_id}`} className="blog-post-link">
            <article className="blog-post-card">
              <h2 className="blog-post-title">{title}</h2>
              <p className="blog-post-author">@{author?.name || "Unknown"}</p>
              <p className="blog-post-excerpt">
                {content.substring(0, 200)}...
              </p>
            </article>
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
