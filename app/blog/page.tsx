"use client";

import { THEME } from "@/lib/theme";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import * as React from "react";
import Image from "next/image";

function Card({ children, interactive = false }: { children: React.ReactNode; interactive?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-5 md:p-6 ${
        interactive ? "hover:shadow-lg hover:shadow-black/30 transition" : ""
      }`}
      style={{ background: THEME.card, borderColor: THEME.cardBorder }}
    >
      {children}
    </div>
  );
}

function GhostButton({ children, className = "", disabled = false }: { children: React.ReactNode; className?: string; disabled?: boolean }) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border transition-colors ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-100'}`}
      style={{ borderColor: THEME.cardBorder, color: THEME.text }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default function BlogPage() {
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
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Blog</h1>
          <p className="text-lg opacity-80">Latest insights on fitness, AI training, and wellness.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Blog Post 1 - Knee-safe lower body */}
          <Card interactive>
            {/* Картинка 4:3 */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border mb-3" style={{ borderColor: THEME.cardBorder }}>
              <Image
                src="/images/athletes-box-squat-technique.webp"
                alt="Home workout setup for knee-safe training"
                layout="fill"
                className="w-full h-full object-cover"
              />
              {/* Бейдж категории */}
              <div className="absolute top-2 left-2">
                <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Lower Body
                </div>
              </div>
            </div>
            
            <div className="text-xs opacity-60">5–7 min read</div>
            <div className="mt-1 text-lg font-semibold">Knee-safe lower body session #1</div>
            <p className="mt-2 text-sm opacity-85">
              Practical tips and alternatives to keep your knees happy while training legs at home or in the gym.
            </p>
            <Link href="/blog/knee-safe-lower-body-1" className="mt-3 inline-block">
              <GhostButton>
                Read <ChevronRight size={16} />
              </GhostButton>
            </Link>
          </Card>

          {/* Blog Post 2 - Bands-only HIIT */}
          <Card interactive>
            {/* Картинка 4:3 */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border mb-3" style={{ borderColor: THEME.cardBorder }}>
              <Image
                src="/images/athletes-perfect-form.webp"
                alt="Athletes demonstrating perfect form with resistance bands"
                layout="fill"
                className="w-full h-full object-cover"
              />
              {/* Бейдж категории */}
              <div className="absolute top-2 left-2">
                <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                  HIIT
                </div>
              </div>
            </div>
            
            <div className="text-xs opacity-60">4–6 min read</div>
            <div className="mt-1 text-lg font-semibold">Bands-only HIIT — 30-min low-impact fat burn (Home)</div>
            <p className="mt-2 text-sm opacity-85">
              High-intensity interval training using only resistance bands for joint-friendly cardio and strength.
            </p>
            <Link href="/blog/bands-only-hiit-30min" className="mt-3 inline-block">
              <GhostButton>
                Read <ChevronRight size={16} />
              </GhostButton>
            </Link>
          </Card>

          {/* Blog Post 3 - TRX Posture Reset */}
          <Card interactive>
            {/* Картинка 4:3 */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border mb-3" style={{ borderColor: THEME.cardBorder }}>
              <Image
                src="/images/trx-row-precision.webp"
                alt="TRX row exercise demonstrating precision and form"
                layout="fill"
                className="w-full h-full object-cover"
              />
              {/* Бейдж категории */}
              <div className="absolute top-2 left-2">
                <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Posture
                </div>
              </div>
            </div>
            
            <div className="text-xs opacity-60">5–7 min read</div>
            <div className="mt-1 text-lg font-semibold">TRX Posture Reset — Back & Core for desk workers</div>
            <p className="mt-2 text-sm opacity-85">
              Reset your posture and strengthen back/core muscles using TRX suspension training.
            </p>
            <Link href="/blog/trx-posture-reset-back-core" className="mt-3 inline-block">
              <GhostButton>
                Read <ChevronRight size={16} />
              </GhostButton>
            </Link>
          </Card>

          {/* Blog Post 4 - Glute Power */}
          <Card interactive>
            {/* Картинка 4:3 */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border mb-3" style={{ borderColor: THEME.cardBorder }}>
              <Image
                src="/images/powerful-glute-thrust.webp"
                alt="Powerful glute thrust exercise demonstration"
                layout="fill"
                className="w-full h-full object-cover"
              />
              {/* Бейдж категории */}
              <div className="absolute top-2 left-2">
                <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Glutes
                </div>
              </div>
            </div>
            
            <div className="text-xs opacity-60">5–7 min read</div>
            <div className="mt-1 text-lg font-semibold">Glute Power without Knee Pain — Hinges & Hip Thrusts</div>
            <p className="mt-2 text-sm opacity-85">
              Build powerful glutes with minimal knee stress using hip hinges and thrust movements.
            </p>
            <Link href="/blog/glute-power-without-knee-pain" className="mt-3 inline-block">
              <GhostButton>
                Read <ChevronRight size={16} />
              </GhostButton>
            </Link>
          </Card>
        </div>
      </main>

      <SiteFooter onNavigate={handleNavigate} />
    </>
  );
}
