"use client";

import { Suspense } from "react";
import LoginPage from "./Login";
import Loading from "@/components/Loading";

export default function LoginWrapper() {
  return (
    <Suspense fallback={<Loading message="Loading login..." />}>
      <LoginPage />
    </Suspense>
  );
}
