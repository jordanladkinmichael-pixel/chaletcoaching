import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";
import { Resend } from "resend";

const RESET_TOKEN_EXPIRY_HOURS = 1;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists (but don't leak this information)
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    // Always return success, even if user doesn't exist (security best practice)
    // But only create token if user exists
    if (user) {
      // Generate secure token
      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + RESET_TOKEN_EXPIRY_HOURS);

      // Delete any existing tokens for this email
      await prisma.passwordResetToken.deleteMany({
        where: { email: normalizedEmail },
      });

      // Create new token
      await prisma.passwordResetToken.create({
        data: {
          email: normalizedEmail,
          token,
          expiresAt,
        },
      });

      // Build reset link
      const baseUrl = process.env.NEXTAUTH_URL || req.headers.get("origin") || "http://localhost:3000";
      const resetLink = `${baseUrl}/auth/reset-password?email=${encodeURIComponent(normalizedEmail)}&token=${token}`;

      // Try to send email via Resend if configured
      const resendApiKey = process.env.RESEND_API_KEY;
      const resendFromEmail = process.env.RESEND_FROM_EMAIL;

      if (resendApiKey && resendFromEmail) {
        try {
          const resend = new Resend(resendApiKey);
          await resend.emails.send({
            from: resendFromEmail,
            to: normalizedEmail,
            subject: "Reset your password",
            html: `
              <p>You requested to reset your password.</p>
              <p>Click the link below to set a new password:</p>
              <p><a href="${resetLink}">${resetLink}</a></p>
              <p>This link will expire in ${RESET_TOKEN_EXPIRY_HOURS} hour(s).</p>
              <p>If you didn't request this, you can safely ignore this email.</p>
            `,
          });
        } catch (emailError) {
          console.error("Failed to send reset email via Resend:", emailError);
          // Fall through to dev mode logging
        }
      }

      // Dev mode: log the link (always log for debugging)
      console.log(`[Password Reset] Link for ${normalizedEmail}: ${resetLink}`);

      // Return devResetLink only in development
      const response: { ok: boolean; devResetLink?: string } = { ok: true };
      if (process.env.NODE_ENV !== "production") {
        response.devResetLink = resetLink;
      }

      return NextResponse.json(response);
    }

    // User doesn't exist, but return success anyway
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Password reset request error:", error);
    // Still return success to avoid leaking information
    return NextResponse.json({ ok: true });
  }
}

