"use client";

import { Suspense } from "react";
import BlogPage from "./BlogPage";
import Loading from "@/components/Loading";

export default function BlogWrapper() {
  return (
    <Suspense fallback={<Loading message="Fetching posts..." />}>
      <BlogPage />
    </Suspense>
  );
}
