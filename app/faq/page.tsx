"use client";

import { THEME } from "@/lib/theme";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import * as React from "react";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border p-5 md:p-6"
      style={{ background: THEME.card, borderColor: THEME.cardBorder }}
    >
      {children}
    </div>
  );
}

export default function FAQPage() {
  // Состояние для валюты
  const [region, setRegion] = React.useState<"EU" | "UK" | "US">("EU");
  
  const faqs = [
    {
      q: "How do tokens work?",
      a: "1 EUR/GBP equals 100 tokens. You spend tokens when generating previews, full courses and exporting PDFs.",
    },
    {
      q: "Is there a refund policy?",
      a: "You can request token refunds for unused balances. Full policy will be available at checkout and in your account.",
    },
    {
      q: "Is it safe?",
      a: "We include injury-safe options and alternatives, but this is not medical advice. Consult a healthcare professional before starting.",
    },
    {
      q: "What equipment do I need?",
      a: "Most workouts can be done with minimal equipment. We provide alternatives for different setups.",
    },
    {
      q: "How often should I train?",
      a: "We recommend 3-4 sessions per week for optimal results, but you can adjust based on your schedule and goals.",
    },
  ];

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
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">FAQ</h1>
          <p className="text-lg opacity-80">Common questions about AIFitWorld and how it works.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <div className="font-semibold">{faq.q}</div>
              <p className="mt-1 text-sm opacity-85">{faq.a}</p>
            </Card>
          ))}
        </div>
      </main>

      <SiteFooter onNavigate={handleNavigate} />
    </>
  );
}
