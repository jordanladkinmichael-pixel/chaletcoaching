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

export default function KneeSafeLowerBodyPage() {
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
            Knee-safe <span style={{ color: THEME.accent }}>Lower Body</span> Session #1
          </h1>
          
          {/* Мета-информация */}
          <div className="flex flex-wrap gap-4 text-sm opacity-70">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>40–45 min</span>
            </div>
            <div className="flex items-center gap-2">
              <Target size={16} />
              <span>Beginners–Intermediate</span>
            </div>
            <div className="flex items-center gap-2">
              <Dumbbell size={16} />
              <span>Minimal Equipment</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Knee-sensitive</span>
            </div>
          </div>
        </div>

        {/* Hero картинка 16:9 */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border" style={{ borderColor: THEME.cardBorder }}>
          <Image
            src="/images/at-home-setup.webp"
            alt="Home workout setup for knee-safe training"
            layout="fill"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Контент в карточках */}
        <div className="grid gap-4 md:gap-5 md:grid-cols-2">
          <Card>
                         <h3 className="font-semibold mb-2">Who it&apos;s for</h3>
            <ul className="list-disc pl-5 space-y-1 opacity-85 text-sm">
              <li>Beginners–intermediate level</li>
              <li>Training at home</li>
              <li>Minimal equipment</li>
              <li>Knee-sensitive individuals</li>
            </ul>
          </Card>

          <Card>
            <h3 className="font-semibold mb-2">Equipment needed</h3>
            <ul className="list-disc pl-5 space-y-1 opacity-85 text-sm">
              <li>Chair/box (40–50 cm)</li>
              <li>1–2 dumbbells or kettlebell</li>
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
              <p className="text-sm opacity-85">Cat–camel × 6, Hip hinge drill × 8, Ankle rocks × 8/side, Glute bridge × 10 (easy)</p>
            </div>

            {/* Main */}
            <div>
              <h4 className="font-medium mb-2" style={{ color: THEME.accent }}>Main (24–26 min)</h4>
              <div className="space-y-3 text-sm opacity-85">
                <div>
                  <strong>Box Squat (chair) — 4×8 @ controlled 3-1-2-0, rest 90 s</strong>
                  <p className="mt-1">Cues: sit back, shins near vertical, light touch, drive up.</p>
                  <p className="mt-1 opacity-70">Alt (easier): Sit-to-stand. Alt (harder): Goblet box squat.</p>
                </div>
                
                <div>
                  <strong>DB RDL — 4×10, rest 90 s</strong>
                  <p className="mt-1">Cues: ribs down, long spine, push hips back, feel hamstrings.</p>
                  <p className="mt-1 opacity-70">Alt: Band hip hinge.</p>
                </div>
                
                <div>
                  <strong>Step-back Split Squat (short ROM) — 3×8/side, rest 75 s</strong>
                  <p className="mt-1">Cues: small stance, tap pad/stacked books as depth limiter.</p>
                  <p className="mt-1 opacity-70">Alt: Static split squat with hands on support.</p>
                </div>
                
                <div>
                  <strong>Mini-band Lateral Walk — 3×12/side, rest 45 s</strong>
                  <p className="mt-1">Cues: soft knees, pelvis level, toes forward.</p>
                </div>
              </div>
            </div>

            {/* Finisher */}
            <div>
              <h4 className="font-medium mb-2" style={{ color: THEME.accent }}>Finisher (4 min)</h4>
              <p className="text-sm opacity-85">EMOM ×4: 20 s Marching high knees + 40 s easy walk (low impact).</p>
            </div>

            {/* Cool-down */}
            <div>
              <h4 className="font-medium mb-2" style={{ color: THEME.accent }}>Cool-down (4–5 min)</h4>
              <p className="text-sm opacity-85">Couch stretch 1 min/side, Hamstring stretch 45 s/side, Breathing 1 min.</p>
            </div>
          </div>
        </Card>

        {/* Прогрессия */}
        <Card>
          <h3 className="font-semibold mb-2">Progression next time</h3>
          <p className="opacity-85 text-sm">
            +1–2 reps Box Squat and RDL or +2–4 kg in total.
          </p>
        </Card>

        {/* Навигация по блогам */}
        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: THEME.cardBorder }}>
          <div className="text-sm opacity-70">← Previous: No previous posts</div>
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
