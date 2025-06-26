import jwt from "jsonwebtoken";

interface JWTPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export function verifyJWT(token: string): JWTPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not configured");
  }

  try {
    const payload = jwt.verify(token, secret) as JWTPayload;
    return payload;
  } catch (error) {
    throw new Error("Invalid token");
  }
}
