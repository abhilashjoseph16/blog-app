import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/middleware/auth";

export async function PATCH(request) {
  await dbConnect();
  let payload;

  try {
    payload = verifyToken(request);
  } catch {
    return new Response(
      JSON.stringify({ message: "Authentication required" }),
      { status: 401 }
    );
  }

  const { name, email, password } = await request.json();
  const update = {};

  if (name) update.name = name;
  if (email) update.email = email;
  if (password) update.password = await bcrypt.hash(password, 10);

  try {
    const updatedUser = await User.findByIdAndUpdate(payload.userId, update, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Failed to update user profile" }),
      { status: 400 }
    );
  }
}

export async function GET(request) {
  await dbConnect();
  let payload;

  try {
    payload = verifyToken(request);
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Authentication required" }),
      { status: 401 }
    );
  }

  const user = await User.findById(payload.userId).select("-password");
  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(user), { status: 200 });
}
