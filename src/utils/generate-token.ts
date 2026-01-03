import jwt from "jsonwebtoken";

export async function generateRefreshToken({
  userId,
  role,
}: {
  userId: String;
  role: String;
}) {
  return jwt.sign({ userId, role }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
}

export async function generateAccessToken({
  userId,
  role,
}: {
  userId: String;
  role: String;
}) {
  return jwt.sign(
    {
      userId,
      role,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" }
  );
}
