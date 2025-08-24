import mongoose from "mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  const { email, password } = await request.json();

  if (!email || !password) {
    return new NextResponse(
      JSON.stringify({ message: "Missing fields" }),
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid credentials" }),
      { status: 401 }
    );
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid credentials" }),
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_TOKEN,
    { expiresIn: "1d" }
  );

  const response = new NextResponse(
    JSON.stringify({
      user: { name: user.name, email: user.email, role: user.role },
    }),
    { status: 200 }
  );

  response.cookies.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
