import { NextResponse } from "next/server";

export async function POST() {
  const res = new NextResponse(null, { status: 200 });

  res.cookies.set("authToken", "", {
    maxAge: 0,
    path: "/",
  });

  return res;
}