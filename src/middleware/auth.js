import jwt from "jsonwebtoken";

export function verifyToken(request) {
  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    throw new Error("No token provided");
  }
  
  try {
    return jwt.verify(token, process.env.JWT_TOKEN);
  } catch (error) {
    throw new Error("Invalid token");
  }

}
