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

export default function GlutePowerPage() {
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
            Glute <span style={{ color: THEME.accent }}>Power</span> without Knee Pain — Hinges & Hip Thrusts
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
              <span>Gym/Home</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Knee-safe</span>
            </div>
          </div>
        </div>

        {/* Hero картинка 16:9 */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border" style={{ borderColor: THEME.cardBorder }}>
          <Image
            src="/images/powerful-glute-thrust.webp"
            alt="Powerful glute thrust exercise demonstration"
            layout="fill"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Контент в карточках */}
        <div className="grid gap-4 md:gap-5 md:grid-cols-2">
          <Card>
                         <h3 className="font-semibold mb-2">Who it&apos;s for</h3>
            <ul className="list-disc pl-5 space-y-1 opacity-85 text-sm">
              <li>Wants strong glutes with minimal knee stress</li>
              <li>Gym or home with a bench</li>
              <li>All fitness levels</li>
              <li>Hip hinge movement pattern focus</li>
            </ul>
          </Card>

          <Card>
            <h3 className="font-semibold mb-2">Equipment needed</h3>
            <ul className="list-disc pl-5 space-y-1 opacity-85 text-sm">
              <li>Bench/sofa edge</li>
              <li>Barbell or dumbbell</li>
              <li>Mini-band</li>
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
              <p className="text-sm opacity-85">Hip airplanes (assisted) ×4/side, Cat–camel ×6, Band external rotations ×12.</p>
            </div>

            {/* Main */}
            <div>
              <h4 className="font-medium mb-2" style={{ color: THEME.accent }}>Main (26–28 min)</h4>
              
              <div className="space-y-3 text-sm opacity-85">
                <div>
                  <strong>Barbell or DB Hip Thrust — 4×8–10, rest 90 s</strong>
                  <p className="mt-1">Cues: posterior pelvic tilt at top, chin tucked, shins near vertical.</p>
                  <p className="mt-1 opacity-70">Alt: Glute bridge on floor.</p>
                </div>
                
                <div>
                  <strong>Romanian Deadlift (DB/BB) — 4×8–10, rest 90 s</strong>
                  <p className="mt-1">Cues: long spine, push hips back, feel hamstrings.</p>
                </div>
                
                <div>
                  <strong>45° Back Extension (controlled) — 3×10–12, rest 75 s</strong>
                  <p className="mt-1 opacity-70">Alt home: Prone hip extension (pillow under hips).</p>
                </div>
                
                <div>
                  <strong>Mini-band Abduction (standing or side-lying) — 3×15/side, rest 45 s</strong>
                </div>
              </div>
            </div>

            {/* Finisher */}
            <div>
              <h4 className="font-medium mb-2" style={{ color: THEME.accent }}>Finisher (4 min)</h4>
              <p className="text-sm opacity-85">EMOM ×4: 20 s glute bridge hold + 40 s rest.</p>
            </div>

            {/* Cool-down */}
            <div>
              <h4 className="font-medium mb-2" style={{ color: THEME.accent }}>Cool-down (5 min)</h4>
              <p className="text-sm opacity-85">Piriformis stretch 45 s/side, Hamstring stretch 45 s/side, Box breathing 1 min.</p>
            </div>
          </div>
        </Card>

        {/* Прогрессия */}
        <Card>
          <h3 className="font-semibold mb-2">Progression</h3>
          <p className="opacity-85 text-sm">
            Increase the weight in thrust/RDL by 2–5 kg or add 1 set to back extension.
          </p>
        </Card>

        {/* Навигация по блогам */}
        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: THEME.cardBorder }}>
          <Link 
            href="/blog/trx-posture-reset-back-core" 
            className="text-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            ← Previous: TRX Posture Reset — Back & Core for desk workers
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
