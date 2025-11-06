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

export default function BandsOnlyHIITPage() {
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
            Bands-only <span style={{ color: THEME.accent }}>HIIT</span> — 30-min low-impact fat burn (Home)
          </h1>
          
          {/* Мета-информация */}
          <div className="flex flex-wrap gap-4 text-sm opacity-70">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>30–35 min</span>
            </div>
            <div className="flex items-center gap-2">
              <Target size={16} />
              <span>Beginners–Intermediate</span>
            </div>
            <div className="flex items-center gap-2">
              <Dumbbell size={16} />
              <span>Home Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Joint-friendly</span>
            </div>
          </div>
        </div>

        {/* Hero картинка 16:9 */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border" style={{ borderColor: THEME.cardBorder }}>
          <Image
            src="/images/athletes-perfect-form.webp"
            alt="Athletes demonstrating perfect form with resistance bands"
            layout="fill"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Контент в карточках */}
        <div className="grid gap-4 md:gap-5 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold mb-2">Who it&apos;s for</h3>
            <ul className="list-disc pl-5 space-y-1 opacity-85 text-sm">
                             <li>Beginners&ndash;intermediate level</li>
               <li>Home setup training</li>
               <li>Joint-friendly cardio/strength</li>
               <li>Low-impact fat burn</li>
            </ul>
          </Card>

          <Card>
            <h3 className="font-semibold mb-2">Equipment needed</h3>
            <ul className="list-disc pl-5 space-y-1 opacity-85 text-sm">
              <li>Long resistance band</li>
              <li>Mini-band</li>
              <li>Light dumbbells (optional)</li>
            </ul>
          </Card>
        </div>

        {/* Основная тренировка */}
        <Card>
          <h3 className="font-semibold mb-3">Session (≈30–35 min)</h3>
          
          <div className="space-y-4">
            {/* Warm-up */}
            <div>
              <h4 className="font-medium mb-2" style={{ color: THEME.accent }}>Warm-up (5–6 min)</h4>
              <p className="text-sm opacity-85">Cat–camel ×6, Hip hinge drill ×8, Ankle rocks ×8/side, Shoulder circles ×10.</p>
            </div>

            {/* Main */}
            <div>
              <h4 className="font-medium mb-2" style={{ color: THEME.accent }}>Main (22–24 min)</h4>
              <p className="text-sm opacity-85 mb-3">Circuit ×3 rounds (work 40 s / rest 20 s):</p>
              
              <div className="space-y-3 text-sm opacity-85">
                <div>
                  <strong>Banded Good Morning — hip hinge focus (hamstrings/glutes)</strong>
                </div>
                
                <div>
                  <strong>Mini-band Lateral Walk — pelvis level, toes forward</strong>
                </div>
                
                <div>
                  <strong>Banded Chest Press (standing) — staggered stance, ribs down</strong>
                </div>
                
                <div>
                  <strong>Banded Row (anchored) — elbows low-to-mid, squeeze back</strong>
                </div>
                
                <div>
                  <strong>DB Goblet Hold March — core brace, slow steps</strong>
                </div>
              </div>
            </div>

            {/* Finisher */}
            <div>
              <h4 className="font-medium mb-2" style={{ color: THEME.accent }}>Finisher (3 min)</h4>
              <p className="text-sm opacity-85">Shadow boxing: 3×40 s on / 20 s off (low impact).</p>
            </div>

            {/* Cool-down */}
            <div>
              <h4 className="font-medium mb-2" style={{ color: THEME.accent }}>Cool-down (4–5 min)</h4>
              <p className="text-sm opacity-85">Couch stretch 45 s/side, Hamstring stretch 45 s/side, Box breathing 1 min.</p>
            </div>
          </div>
        </Card>

        {/* Прогрессия */}
        <Card>
          <h3 className="font-semibold mb-2">Progression</h3>
          <p className="opacity-85 text-sm">
            Add 1 round or increase tension by 10–15%.
          </p>
        </Card>

        {/* Навигация по блогам */}
        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: THEME.cardBorder }}>
          <Link 
            href="/blog/knee-safe-lower-body-1" 
            className="text-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            ← Previous: Knee-safe lower body session #1
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
