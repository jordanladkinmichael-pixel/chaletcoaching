"use client";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import {
  ToastContainer,
  type Toast,
  type ToastType,
} from "@/components/ui";
import { THEME } from "@/lib/theme";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import * as React from "react";
import ContactForm from "./ContactForm";


export default function ContactPage() {
  const { data: session } = useSession();
  const isAuthed = !!session?.user;
  const [balance, setBalance] = React.useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = React.useState(true);
  const [region, setRegion] = React.useState<"EU" | "UK" | "US">("EU");
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = (
    type: ToastType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((toasts) => [...toasts, { id, type, title, message, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((toasts) => toasts.filter((t) => t.id !== id));
  };

  const handleOpenAuth = (mode: "signin" | "signup") => {
    console.log("Open auth:", mode);
  };

  const handleNavigate = (page: string) => {
    if (page === "home") {
      window.location.href = "/";
    } else {
      window.location.href = `/#${page}`;
    }
  };

  React.useEffect(() => {
    if (isAuthed) {
      setBalanceLoading(true);
      fetch("/api/tokens/balance")
        .then((res) => res.json())
        .then((data) => {
          setBalance(data.balance);
        })
        .catch((error) => {
          console.error("Error fetching balance:", error);
          addToast("error", "Error", "Could not fetch token balance.");
        })
        .finally(() => {
          setBalanceLoading(false);
        });
    }
  }, [isAuthed]);

  return (
    <>
      <SiteHeader
        onOpenAuth={handleOpenAuth}
        onNavigate={handleNavigate}
        region={region}
        setRegion={setRegion}
        balance={balance}
        balanceLoading={balanceLoading}
      />

      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Contact Us
        </h1>
        <p className="mt-2 opacity-80">
          Questions, feedback, or partnership ideas? Send us a message — we usually reply within 1–2 business days.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Left: company info */}
          <section
            className="rounded-2xl border p-5 md:p-6"
            style={{ background: THEME.card, borderColor: THEME.cardBorder }}
          >
            <h2 className="text-xl font-semibold">Company</h2>

            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Building2 size={18} style={{ color: THEME.accent }} />
                <div>
                  <div className="font-medium">BREATHE FRESH LTD</div>
                  <div className="opacity-80">Company number 15954655</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MapPin size={18} style={{ color: THEME.accent }} />
                <div className="opacity-90">
                  12 King Street, Nottingham, England, NG1 2AS
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail size={18} style={{ color: THEME.accent }} />
                <Link href="mailto:info@aifitworld.co.uk" className="underline">
                  info@aifitworld.co.uk
                </Link>
              </li>

              <li className="flex items-start gap-3">
                <Phone size={18} style={{ color: THEME.accent }} />
                <Link href="tel:+447418604319" className="underline">
                  +44 7418 604319
                </Link>
              </li>
            </ul>

            <div className="mt-6 text-xs opacity-70">
              Prefer email? Write to us directly and include any relevant screenshots or order IDs.
            </div>
          </section>

          {/* Right: contact form */}
          <section
            className="rounded-2xl border p-5 md:p-6"
            style={{ background: THEME.card, borderColor: THEME.cardBorder }}
          >
            <h2 className="text-xl font-semibold">Send a message</h2>
            <ContactForm />
          </section>
        </div>
      </main>

      <SiteFooter onNavigate={handleNavigate} />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
