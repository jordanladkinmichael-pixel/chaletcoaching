import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const rateLimitMap = new Map<string, number[]>();

function getClientIP(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "unknown";
}

function checkRateLimit(ip: string, windowMs: number, maxRequests: number) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((ts) => now - ts < windowMs);
  if (recent.length >= maxRequests) {
    return { allowed: false };
  }
  recent.push(now);
  rateLimitMap.set(ip, recent);

  // simple cleanup guard
  if (rateLimitMap.size > 2000) {
    for (const [key, values] of rateLimitMap.entries()) {
      const filtered = values.filter((ts) => now - ts < windowMs);
      if (filtered.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, filtered);
      }
    }
  }

  return { allowed: true };
}

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  country: z.string().min(1),
  primaryFocus: z.string().min(2),
  experience: z.enum(["1-2", "3-5", "6-10", "10+"]),
  languages: z.array(z.string()).min(1).max(10),
  proofLinks: z
    .array(z.string().trim().url({ message: "Invalid URL" }))
    .min(1)
    .max(5)
    .refine(
      (links) => links.every((link) => isHttpUrl(link)),
      "Links must start with http or https"
    ),
  bio: z.string().min(200),
  notes: z.string().optional(),
  confirmAccuracy: z.literal(true),
  agreeTermsPrivacy: z.literal(true),
  company: z.string().optional(), // honeypot
});

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID ? crypto.randomUUID() : `req_${Date.now()}`;
  try {
    const json = await request.json();

    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      const firstError =
        parsed.error.issues?.[0]?.message || "Invalid request payload";
      return NextResponse.json({ ok: false, error: firstError }, { status: 400 });
    }

    const data = parsed.data;

    // Honeypot: silent success
    if (data.company && data.company.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const ip = getClientIP(request);
    if (ip !== "unknown") {
      const rate = checkRateLimit(ip, 10 * 60 * 1000, 3);
      if (!rate.allowed) {
        return NextResponse.json(
          { ok: false, error: "Too many requests right now. Please try again in 10 minutes." },
          { status: 429 }
        );
      }
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "Email service not configured." },
        { status: 500 }
      );
    }

    const from = process.env.COACH_APPLICATION_FROM || "info@chaletcoaching.co.uk";
    const adminTo =
      process.env.COACH_APPLICATION_ADMIN_TO || "info@chaletcoaching.co.uk";
    const applicantTo = data.email;

    const timestamp = new Date().toISOString();

    const applicantSubject = "Thanks for applying to coach with Chalet Coaching";
    const applicantText = [
      `Hi ${data.fullName || "there"},`,
      "",
      "Thanks for applying to coach with Chalet Coaching. We received your application and will review it.",
      `Focus: ${data.primaryFocus}`,
      "",
      "We’ll reply by email. We do not promise timelines.",
      "",
      "— Chalet Coaching Team | info@chaletcoaching.co.uk",
    ].join("\n");

    const managerSubject = `New Coach Application — ${data.fullName} (${data.primaryFocus})`;
    const managerLines = [
      `New coach application received (${timestamp})`,
      `Request ID: ${requestId}`,
      "",
      `Name: ${data.fullName}`,
      `Email: ${data.email}`,
      `Country: ${data.country}`,
      `Experience: ${data.experience}`,
      `Languages: ${data.languages.join(", ")}`,
      `Primary focus: ${data.primaryFocus}`,
      "",
      "Proof links:",
      ...data.proofLinks.map((link) => `- ${link}`),
      "",
      `Bio: ${data.bio}`,
      "",
      data.notes ? `Notes: ${data.notes}` : "Notes: (none)",
    ];

    const [applicantResult, managerResult] = await Promise.all([
      resend.emails.send({
        from,
        to: applicantTo,
        replyTo: applicantTo,
        subject: applicantSubject,
        text: applicantText,
      }),
      resend.emails.send({
        from,
        to: adminTo,
        replyTo: applicantTo,
        subject: managerSubject,
        text: managerLines.join("\n"),
      }),
    ]);

    if (applicantResult.error || managerResult.error) {
      console.error("coach-applications email error", {
        requestId,
        applicantError: applicantResult.error,
        managerError: managerResult.error,
      });
      return NextResponse.json(
        { ok: false, error: "Something went wrong sending emails." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("coach-applications error", { requestId, error });
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}

