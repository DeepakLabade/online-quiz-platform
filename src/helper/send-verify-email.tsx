import { verifyUserEmail } from "@/email/verify-user-email";
import resend from "@/lib/resend";

export async function sendVerificationEmail({
  username,
  email,
  verifyCode,
}: {
  username: string;
  email: string;
  verifyCode: string;
}) {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email address",
   react: verifyUserEmail({username, OTP: verifyCode})
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error("Failed to send verification email");
  }

  return data;
}
