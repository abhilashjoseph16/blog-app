import { dbConnect } from "@/lib/mongodb";
import { verifyToken } from "@/middleware/auth";
import Post from "@/models/Post";
import Comment from "@/models/Comment";

export async function GET(request, { params }) {
  await dbConnect();

  const { postId } =await params;
  const post = await Post.findById(postId)
    .populate("author", "name email")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "name email",
      },
    });

  if (!post) {
    return new Response(JSON.stringify({ message: "Post not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(post), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PATCH(request, { params }) {
  await dbConnect();
  let payload;
  try {
    payload = verifyToken(request);
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 401,
    });
  }

  const { postId } = params;
  const { title, content } = await request.json();

  const post = await Post.findById(postId);
  if (!post) {
    return new Response(JSON.stringify({ message: "Post not found" }), {
      status: 404,
    });
  }
  if (post.author.toString() !== payload.userId && payload.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 403,
    });
  }

  if (title) {
    post.title = title;
  }
  if (content) {
    post.content = content;
  }
  post.updatedAt = new Date();
  await post.save();

  return new Response(JSON.stringify(post), { status: 200 });
}

export async function DELETE(request, { params }) {
  await dbConnect();
  let payload;
  try {
    payload = verifyToken(request);
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 401,
    });
  }

  const { postId } = params;
  const post = await Post.findById(postId);

  if (!post) {
    return new Response(JSON.stringify({ message: "Post not found" }), {
      status: 404,
    });
  }

  if (post.author.toString() !== payload.userId && payload.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 403,
    });
  }

  await Post.findByIdAndDelete(postId);
  return new Response(JSON.stringify({ message: "Post deleted" }), {
    status: 200,
  });
}
