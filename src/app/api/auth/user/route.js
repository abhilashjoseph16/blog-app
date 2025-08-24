import { verifyToken } from "@/middleware/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
export async function GET(request) {
  try {
    await dbConnect();
    const payload = verifyToken(request);
    const user = await User.findById(payload.userId).select(
      "_id name email role"
    );

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 401,
    });
  }
}
