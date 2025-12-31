import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateWorkoutPlan, generateFitnessImages, FitnessContentRequest } from "@/lib/openai";
import { prisma } from "@/lib/db";
import { generateCourseTitle, PREVIEW_COST } from "@/lib/tokens";
import { getUserBalance } from "@/lib/balance";

export async function POST(request: NextRequest) {
  try {
    // Проверяем аутентификацию
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Received request body:", body);
    
    // Извлекаем опции из body.opts или напрямую из body
    const opts = body.opts || body;
    const { weeks, sessionsPerWeek, injurySafe, specialEquipment, nutritionTips, workoutTypes, targetMuscles, gender, images } = opts;

    console.log("Extracted options:", { weeks, sessionsPerWeek, injurySafe, specialEquipment, nutritionTips, workoutTypes, targetMuscles, gender, images });

    // Валидация входных данных
    if (!weeks || !sessionsPerWeek || !workoutTypes || !targetMuscles || !gender) {
      return NextResponse.json({ 
        error: "Missing required fields", 
        received: { weeks, sessionsPerWeek, workoutTypes, targetMuscles, gender },
        required: ["weeks", "sessionsPerWeek", "workoutTypes", "targetMuscles", "gender"]
      }, { status: 400 });
    }

    // Проверяем баланс до генерации
    const balance = await getUserBalance(session.user.id);
    if (balance < PREVIEW_COST) {
      return NextResponse.json(
        {
          error: "Insufficient tokens",
          required: PREVIEW_COST,
          available: balance,
        },
        { status: 400 }
      );
    }

    // Создаем запрос для OpenAI
    const fitnessRequest: FitnessContentRequest = {
      weeks,
      sessionsPerWeek,
      injurySafe: injurySafe || false,
      specialEquipment: specialEquipment || false,
      nutritionTips: nutritionTips || false,
      workoutTypes,
      targetMuscles,
      gender,
    };

    console.log("Fitness request:", fitnessRequest);

    // Генерируем контент с OpenAI
    const [workoutPlan, imageUrls] = await Promise.all([
      generateWorkoutPlan(fitnessRequest),
      images > 0 ? generateFitnessImages(fitnessRequest, images) : Promise.resolve([])
    ]);

    // Создаем превью курс
    const previewCourse = {
      title: generateCourseTitle(fitnessRequest),
      description: workoutPlan.substring(0, 200) + "...",
      options: fitnessRequest,
      content: workoutPlan,
      images: imageUrls,
      createdAt: new Date().toISOString(),
      type: "preview",
      userId: session.user.email,
    };

    // Сохраняем превью в базу данных (с учетом стоимости)
    const savedPreview = await prisma.preview.create({
      data: {
        userId: session.user.id,
        options: JSON.stringify(fitnessRequest),
        tokensSpent: PREVIEW_COST,
        result: JSON.stringify({
          workoutPlan,
          imageUrls,
          title: previewCourse.title,
          description: previewCourse.description
        }),
      },
    });

    console.log("Preview saved to database:", savedPreview.id);

    // Best-effort защита от двойного списания (10s окно)
    const tenSecondsAgo = new Date(Date.now() - 10_000);
    const recent = await prisma.transaction.findFirst({
      where: {
        userId: session.user.id,
        type: "spend",
        amount: -PREVIEW_COST,
        createdAt: { gte: tenSecondsAgo },
        meta: { contains: '"reason":"preview"' },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!recent) {
      // Создаем транзакцию списания
      await prisma.transaction.create({
        data: {
          userId: session.user.id,
          type: "spend",
          amount: -PREVIEW_COST,
          meta: JSON.stringify({
            reason: "preview",
            previewId: savedPreview.id,
          }),
        },
      });
    }

    // Пересчитываем баланс после списания (или пропуска, если recent был)
    const newBalance = await getUserBalance(session.user.id);

    return NextResponse.json({
      success: true,
      course: previewCourse,
      previewId: savedPreview.id,
      message: "Preview generated successfully",
      newBalance,
    });

  } catch (error) {
    console.error("Error generating preview:", error);
    return NextResponse.json(
      { error: "Failed to generate preview" },
      { status: 500 }
    );
  }
}
