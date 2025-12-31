import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { generatePDF } from "@/inngest/functions/pdf-generation";
import { helloWorld } from "@/inngest/functions/hello-world";

// Runtime configuration for Vercel
export const runtime = 'nodejs'; // Inngest functions use Prisma which requires Node.js
export const maxDuration = 300; // 5 minutes for long-running PDF generation tasks

// Экспортируем все Inngest функции
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generatePDF,
    helloWorld,
  ],
  signingKey: process.env.CHALETCOACHING_INNGEST_SIGNING_KEY,
});

