/**
 * PDF Content Formatter
 * Formats course content into compact HTML for PDF (max 4 pages)
 */

import { openai } from "@/lib/openai";

export interface FormatContentOptions {
  content: string;
  nutritionAdvice?: string | null;
  weeks: number;
  sessionsPerWeek: number;
  workoutTypes: string[];
  targetMuscles: string[];
  injurySafe?: boolean;
  specialEquipment?: boolean;
}

/**
 * Format course content into compact HTML for PDF using OpenAI
 * Optimized for maximum 4 pages
 */
export async function formatContentForPDF(
  options: FormatContentOptions
): Promise<string> {
  const {
    content,
    nutritionAdvice,
    weeks,
    sessionsPerWeek,
    workoutTypes,
    targetMuscles,
    injurySafe = false,
    specialEquipment = false,
  } = options;

  try {
    const prompt = buildFormattingPrompt({
      content,
      nutritionAdvice,
      weeks,
      sessionsPerWeek,
      workoutTypes,
      targetMuscles,
      injurySafe,
      specialEquipment,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a professional fitness trainer creating a compact PDF document (maximum 4 pages).
Your task is to transform workout content into a concise, well-structured HTML format optimized for printing.

Requirements:
- Use HTML tables for weekly schedules (compact format)
- Use bullet points for exercises (not paragraphs)
- Keep text minimal but informative
- Structure: Overview → Weekly Schedule → Key Exercises → Nutrition (if provided)
- Use semantic HTML: <table>, <ul>, <li>, <h2>, <h3>
- NO markdown formatting (no #, *, etc.)
- Maximum 4 pages when printed
- Font size: 12-14px for body, 16-18px for headings
- Use inline styles for print optimization`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000, // Further reduced for ultra-compact PDF
      temperature: 0.3, // Lower temperature for more concise output
    });

    return completion.choices[0]?.message?.content || content;
  } catch (error) {
    console.error("Error formatting content for PDF:", error);
    // Fallback to original content if formatting fails
    return content;
  }
}

/**
 * Build formatting prompt for OpenAI
 */
function buildFormattingPrompt(options: FormatContentOptions): string {
  const {
    content,
    nutritionAdvice,
    weeks,
    sessionsPerWeek,
    workoutTypes,
    targetMuscles,
    injurySafe,
    specialEquipment,
  } = options;

  let prompt = `Transform the following fitness program content into a compact HTML format for PDF (maximum 4 pages).

PROGRAM DETAILS:
- Duration: ${weeks} weeks
- Sessions per week: ${sessionsPerWeek}
- Workout types: ${workoutTypes.join(", ")}
- Target muscles: ${targetMuscles.join(", ")}
${injurySafe ? "- Injury-safe modifications included" : ""}
${specialEquipment ? "- Special equipment required" : ""}

ORIGINAL CONTENT:
${content}

`;

  if (nutritionAdvice) {
    prompt += `NUTRITION ADVICE (include this in a compact section):
${nutritionAdvice}

`;
  }

  prompt += `OUTPUT REQUIREMENTS (STRICT - MUST FIT IN 4 PAGES):
1. Overview: Maximum 2-3 sentences (very brief)
2. Weekly Schedule: Use compact table with columns: Week | Focus | Exercises (abbreviated) | Notes (1-2 words)
3. Exercises: Use bullet points ONLY - format: "Exercise name: Sets×Reps (Rest)"
4. ${nutritionAdvice ? "Nutrition: Maximum 5 bullet points (very brief tips)" : "Skip nutrition section"}
5. Use HTML tables for ALL structured data (not divs or paragraphs)
6. Keep ALL text extremely concise - use abbreviations where possible
7. NO long descriptions - only essential information
8. Maximum 1-2 sentences per exercise description
9. Use inline styles: font-size: 10px, line-height: 1.3, margin: 2px
10. CRITICAL: Total content MUST fit in exactly 4 pages when printed

Generate clean HTML without markdown. Start with <div class="overview"> and use semantic HTML elements.
Be extremely concise - every word counts!`;

  return prompt;
}

/**
 * Parse and clean content for basic formatting (fallback)
 */
export function formatContentBasic(content: string): string {
  // Basic formatting: convert markdown-like patterns to HTML
  let formatted = content;

  // Convert headers
  formatted = formatted.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  formatted = formatted.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  formatted = formatted.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Convert bullet points
  formatted = formatted.replace(/^[-*] (.*$)/gim, "<li>$1</li>");
  formatted = formatted.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

  // Convert line breaks
  formatted = formatted.replace(/\n\n/g, "</p><p>");
  formatted = formatted.replace(/\n/g, "<br>");

  // Wrap in paragraphs
  if (!formatted.includes("<p>")) {
    formatted = `<p>${formatted}</p>`;
  }

  return formatted;
}

