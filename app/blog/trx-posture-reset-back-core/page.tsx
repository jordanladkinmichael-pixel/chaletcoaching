"use client";

import { THEME } from "@/lib/theme";
import { ArrowLeft, Clock, Target, Dumbbell, Users } from "lucide-react";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import * as React from "react";
import Image from "next/image";

// Малая локальная карточка, как в политиках
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border p-5 md:p-6"
      style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}
    >
      {children}
    </div>
  );
}

export default function TRXPostureResetPage() {
  // Состояние для валюты
  const [region, setRegion] = React.useState<"EU" | "UK" | "US">("EU");
  
  // Функции для хедера
  const handleOpenAuth = (mode: "signin" | "signup") => {
    console.log("Open auth:", mode);
  };

  const handleNavigate = (page: string) => {
    if (page === "home") {
      window.location.href = "/";
    } else {
      console.log("Navigate to:", page);
    }
  };

  return (
    <>
      <SiteHeader onOpenAuth={handleOpenAuth} onNavigate={handleNavigate} region={region} setRegion={setRegion} />
      
      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-8">
        {/* Кнопка назад */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {/* Заголовок и мета-информация */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            TRX <span style={{ color: THEME.accent }}>Posture Reset</span> — Back & Core for desk workers
          </h1>
          
          {/* Мета-информация */}
          <div className="flex flex-wrap gap-4 text-sm opacity-70">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>40–45 min</span>
            </div>
            <div className="flex items-center gap-2">
              <Target size={16} />
              <span>All Levels</span>
            </div>
            <div className="flex items-center gap-2">
              <Dumbbell size={16} />
              <span>TRX/Suspension</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Desk Workers</span>
            </div>
          </div>
        </div>

        {/* Hero картинка 16:9 */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border" style={{ borderColor: THEME.cardBorder }}>
          <Image
            src="/images/trx-row-precision.webp"
            alt="TRX row exercise demonstrating precision and form"
            layout="fill"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Контент в карточках */}
        <div className="grid gap-4 md:gap-5 md:grid-cols-2">
          <Card>
                         <h3 className="font-semibold mb-2">Who it&apos;s for</h3>
            <ul className="list-disc pl-5 space-y-1 opacity-85 text-sm">
              <li>Anyone with rounded-shoulder posture</li>
              <li>Wants back/core without knee stress</li>
              <li>Desk workers and office professionals</li>
              <li>All fitness levels</li>
            </ul>
          </Card>

          <Card>
            <h3 className="font-semibold mb-2">Equipment needed</h3>
            <ul className="list-disc pl-5 space-y-1 opacity-85 text-sm">
              <li>TRX/suspension straps</li>
              <li>Mat</li>
              <li>Light dumbbell (optional)</li>
            </ul>
          </Card>
        </div>

        {/* Основная тренировка */}
        <Card>
          <h3 className="font-semibold mb-3">Session (≈40–45 min)</h3>
          
          <div className="space-y-4">
            {/* Warm-up */}
            <div>
              <h4 className="font-medium mb-2" style={{ color: THEME.accent }}>Warm-up (6 min)</h4>
              <p className="text-sm opacity-85">Thoracic rotations ×6/side, Scapular wall slides ×8, Glute bridges ×10.</p>
            </div>

            {/* Main */}
            <div>
              <h4 className="font-medium mb-2" style={{ color: THEME.accent }}>Main (26–28 min)</h4>
              
              <div className="space-y-3 text-sm opacity-85">
                <div>
                  <strong>TRX Row — 4×10–12, rest 75 s</strong>
                  <p className="mt-1">Cues: shoulders down-and-back, ribs stacked, squeeze mid-back.</p>
                  <p className="mt-1 opacity-70">Alt: Chest-supported row.</p>
                </div>
                
                <div>
                  <strong>TRX Y-Raise — 3×10, rest 60 s</strong>
                  <p className="mt-1">Cues: long arms, avoid shrug, thumbs up.</p>
                </div>
                
                <div>
                  <strong>Pallof Press (cable/band) — 3×12/side, rest 45 s</strong>
                  <p className="mt-1">Cues: anti-rotation, hips level.</p>
                </div>
                
                <div>
                  <strong>TRX Hamstring Curl — 3×8–12, rest 75 s</strong>
                  <p className="mt-1">Cues: heels heavy in straps, posterior tilt, slow eccentrics.</p>
                </div>
              </div>
            </div>

            {/* Finisher */}
            <div>
              <h4 className="font-medium mb-2" style={{ color: THEME.accent }}>Finisher (4 min)</h4>
              <p className="text-sm opacity-85">20 s high-arm march + 40 s easy breathing ×4.</p>
            </div>

            {/* Cool-down */}
            <div>
              <h4 className="font-medium mb-2" style={{ color: THEME.accent }}>Cool-down (5 min)</h4>
              <p className="text-sm opacity-85">Pec doorway stretch 45 s/side, Long spine decompression 60 s, Nasal breathing 1 min.</p>
            </div>
          </div>
        </Card>

        {/* Прогрессия */}
        <Card>
          <h3 className="font-semibold mb-2">Progression</h3>
          <p className="opacity-85 text-sm">
            Reduce the angle of your body during TRX exercises (more difficult) or add 1 set.
          </p>
        </Card>

        {/* Навигация по блогам */}
        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: THEME.cardBorder }}>
          <Link 
            href="/blog/bands-only-hiit-30min" 
            className="text-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            ← Previous: Bands-only HIIT — 30-min low-impact fat burn (Home)
          </Link>
          <Link 
            href="/blog" 
            className="text-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            Back to Blog
          </Link>
        </div>
      </main>

      <SiteFooter onNavigate={handleNavigate} />
    </>
  );
}
