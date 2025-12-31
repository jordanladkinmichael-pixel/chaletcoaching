import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calcCoachRequestTokens } from "@/lib/tokens";
import { getUserBalance } from "@/lib/balance";
import { prisma } from "@/lib/db";
import coachesData from "@/coaches_seed_15.json";

/**
 * Coach requests endpoint
 * POST /api/coach-requests
 * Requires authentication
 * Body: { coachId, coachSlug, goal, level, trainingType, equipment, daysPerWeek, notes }
 */

interface CoachRequestBody {
  coachId: string;
  coachSlug: string;
  goal: string;
  level: string;
  trainingType: string;
  equipment: string;
  daysPerWeek: number;
  notes?: string;
}

// Helper to get coach snapshot from seed data
function getCoachSnapshot(coachSlug: string, coachId: string) {
  if (!Array.isArray(coachesData)) return null;
  return coachesData.find(
    (c) => (c.slug && c.slug === coachSlug) || (c.id && c.id === coachId)
  ) as
    | {
        name?: string;
        avatar?: string;
      }
    | undefined
    | null;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: CoachRequestBody = await request.json();

    // Validate required fields
    if (!body.coachId || !body.coachSlug || !body.goal || !body.level || !body.trainingType || !body.equipment || !body.daysPerWeek) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate daysPerWeek (2-6)
    if (body.daysPerWeek < 2 || body.daysPerWeek > 6) {
      return NextResponse.json(
        { error: "daysPerWeek must be between 2 and 6" },
        { status: 400 }
      );
    }

    // Calculate cost
    const costBreakdown = calcCoachRequestTokens({
      level: body.level,
      trainingType: body.trainingType,
      equipment: body.equipment,
      daysPerWeek: body.daysPerWeek,
    });

    // Check balance
    const balance = await getUserBalance(session.user.id);
    if (balance < costBreakdown.total) {
      return NextResponse.json(
        { 
          error: "Insufficient tokens", 
          balance,
          required: costBreakdown.total,
        },
        { status: 400 }
      );
    }

    // Deduct tokens immediately
    const tx = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: "spend",
        amount: -costBreakdown.total,
        meta: JSON.stringify({ 
          reason: "coach_request",
          coachId: body.coachId,
          coachSlug: body.coachSlug,
          costBreakdown,
        }),
      },
      select: { id: true },
    });

    // Persist coach request
    const coach = getCoachSnapshot(body.coachSlug, body.coachId);
    const coachRequest = await prisma.coachRequest.create({
      data: {
        userId: session.user.id,
        coachId: body.coachId,
        coachSlug: body.coachSlug,
        coachName: coach?.name ?? null,
        coachAvatar: coach?.avatar ?? null,
        goal: body.goal,
        level: body.level,
        trainingType: body.trainingType,
        equipment: body.equipment,
        daysPerWeek: body.daysPerWeek,
        notes: body.notes || null,
        status: "pending",
        tokensCharged: costBreakdown.total,
        transactionId: tx.id,
      },
    });

    // Get updated balance
    const newBalance = await getUserBalance(session.user.id);

    return NextResponse.json({
      success: true,
      requestId: coachRequest.id,
      status: coachRequest.status,
      message: "Request received",
      tokensCharged: costBreakdown.total,
      newBalance,
    });
  } catch (error) {
    console.error("Error creating coach request:", error);
    return NextResponse.json(
      { error: "Failed to create coach request" },
      { status: 500 }
    );
  }
}

// GET /api/coach-requests — list current user requests (max 50, newest first)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.coachRequest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        status: true,
        createdAt: true,
        coachSlug: true,
        coachName: true,
        coachAvatar: true,
        goal: true,
        level: true,
        trainingType: true,
        equipment: true,
        daysPerWeek: true,
        tokensCharged: true,
      },
    });

    return NextResponse.json({ ok: true, items });
  } catch (error) {
    console.error("Error listing coach requests:", error);
    return NextResponse.json(
      { error: "Failed to list coach requests" },
      { status: 500 }
    );
  }
}

