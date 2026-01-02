import jwt from "jsonwebtoken";

export async function generateRefreshToken(userId: String) {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
}

export async function generateAccessToken(userId: String) {
  return jwt.sign(
    {
      userId,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" }
  );
}
