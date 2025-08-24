import { dbConnect } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { verifyToken } from "@/middleware/auth";

export async function DELETE(request, { params }) {
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

  const { commentId } = await params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return new Response(JSON.stringify({ message: "Comment not found" }), {
      status: 404,
    });
  }

  if (comment.author.toString() !== user.userId && user.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 403,
    });
  }

  await Comment.findByIdAndDelete(commentId);

  return new Response(JSON.stringify({ message: "Comment deleted" }), {
    status: 200,
  });
}
export async function PATCH(request, { params }) {
  await dbConnect();
  let user;

  try {
    user = verifyToken(request);
  } catch {
    return new Response(
      JSON.stringify({ message: "Authentication required" }),
      { status: 401 }
    );
  }

  const { commentId } = await params;
  const { content } = await request.json();

  if (!content || typeof content !== "string" || !content.trim()) {
    return new Response(JSON.stringify({ message: "Content is required" }), {
      status: 400,
    });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return new Response(JSON.stringify({ message: "Comment not found" }), {
        status: 404,
      });
    }

    if (comment.author.toString() !== user.userId && user.role !== "admin") {
      return new Response(
        JSON.stringify({ message: "Unauthorized to update comment" }),
        { status: 403 }
      );
    }

    comment.content = content.trim();
    await comment.save();

    return new Response(JSON.stringify(comment), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to update comment" }),
      { status: 500 }
    );
  }
}
