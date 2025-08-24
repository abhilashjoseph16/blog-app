"use client";

import { Suspense } from "react";
import HomePage from "./HomePage";
import Loading from "@/components/Loading";

export default function HomePageWrapper() {
  return (
    <Suspense fallback={<Loading message="Loading..." />}>
      <HomePage />
    </Suspense>
  );
}
