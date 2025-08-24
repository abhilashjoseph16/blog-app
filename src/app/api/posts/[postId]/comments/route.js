import { dbConnect } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { verifyToken } from "@/middleware/auth";
import Post from "@/models/Post";

export async function GET(request, { params }) {
  await dbConnect();
  const { postId } = await params;

  const comments = await Comment.find({ post: postId })
    .populate("author", "name email")
    .sort({ createdAt: -1 });

  return new Response(JSON.stringify(comments), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request, { params }) {
  await dbConnect();
  let user;

  try {
    user = verifyToken(request);
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Authentication required" }),
      { status: 401 }
    );
  }

  const { postId } = await params;
  const { content } = await request.json();

  if (!content) {
    return new Response(JSON.stringify({ message: "Content is required" }), {
      status: 400,
    });
  }

  const newComment = await Comment.create({
    post: postId,
    author: user.userId,
    content,
  });

  await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });

  return new Response(JSON.stringify(newComment), { status: 201 });
}
