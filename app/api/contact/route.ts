import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, number[]>();

function getClientIP(req: NextRequest): string {
  // Try x-forwarded-for first (for proxies/load balancers)
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim();
  }
  
  // Fallback to req.ip if available (Next.js may provide this)
  // Note: In Next.js App Router, req.ip might not be available
  // We'll use a fallback to a default value if needed
  return "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; remaining?: number } {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 5;

  // Clean up old entries periodically (simple cleanup)
  if (rateLimitMap.size > 1000) {
    // Clean entries older than 10 minutes
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const recent = timestamps.filter((ts) => now - ts < windowMs);
      if (recent.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, recent);
      }
    }
  }

  const requests = rateLimitMap.get(ip) || [];
  const recentRequests = requests.filter((timestamp) => now - timestamp < windowMs);

  if (recentRequests.length >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return { allowed: true, remaining: maxRequests - recentRequests.length };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, topic, message, companyWebsite } = body;

    // Honeypot check: if companyWebsite is filled, it's spam
    if (companyWebsite && companyWebsite.trim().length > 0) {
      // Return success to avoid revealing honeypot
      return NextResponse.json({ ok: true });
    }

    // Rate limiting
    const ip = getClientIP(req);
    if (ip !== "unknown") {
      const rateLimit = checkRateLimit(ip);
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { ok: false, error: "Too many requests. Please try again in 10 minutes." },
          { status: 429 }
        );
      }
    }

    // Validation
    if (!name || !email || !topic || !message) {
      return NextResponse.json(
        { ok: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { ok: false, error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (typeof message !== "string" || message.trim().length < 20) {
      return NextResponse.json(
        { ok: false, error: "Message must be at least 20 characters" },
        { status: 400 }
      );
    }

    // Send email via Resend
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      // Log server-side for debugging
      console.log("Contact form submission:", { name, email, topic, message });
      // Return success even without email service configured
      return NextResponse.json({ ok: true });
    }

    const { data, error } = await resend.emails.send({
      from: "Chaletcoaching Contact Form <info@chaletcoaching.co.uk>",
      to: ["info@chaletcoaching.co.uk"],
      replyTo: email,
      subject: `Contact Form: ${topic}`,
      html: `
        <h3>New contact form submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Topic:</strong> ${topic}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p><em>Reply to: ${email}</em></p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to send email. Please try again or email us directly." },
        { status: 500 }
      );
    }

    console.log("Contact email sent successfully:", data);
    return NextResponse.json({ ok: true, id: data?.id });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { ok: false, error: "An error occurred. Please try again or email us directly." },
      { status: 500 }
    );
  }
}

