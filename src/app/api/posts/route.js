import { dbConnect } from "@/lib/mongodb";
import { verifyToken } from "@/middleware/auth";
import Post from "@/models/Post";
import User from "@/models/User";
import Comment from "@/models/Comment";

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const titleQuery = searchParams.get("title") || "";
  const authorQuery = searchParams.get("author") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  let authorFilter = {};
  if (authorQuery) {
    const authors = await User.find({
      name: { $regex: authorQuery, $options: "i" },
    }).select("_id");
    authorFilter = { author: { $in: authors.map((a) => a._id) } };
  }

  const total = await Post.countDocuments({
    title: { $regex: titleQuery, $options: "i" },
    ...authorFilter,
  });

  const posts = await Post.find({
    title: { $regex: titleQuery, $options: "i" },
    ...authorFilter,
  })
    .populate("author", "name email")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "_id name email",
      },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return new Response(
    JSON.stringify({ posts, total, page, pages: Math.ceil(total / limit) }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function POST(request) {
  await dbConnect();
  let user;
  try {
    user = verifyToken(request);
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 401,
    });
  }
  const { title, content } = await request.json();

  if (!title || !content) {
    return new Response(JSON.stringify({ message: "Missing fields" }), {
      status: 400,
    });
  }

  const newPost = await Post.create({
    title,
    content,
    author: user.userId,
  });
  return new Response(JSON.stringify(newPost), { status: 201 });
}