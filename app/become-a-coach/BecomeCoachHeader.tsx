"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useState } from "react";
import SiteHeader from "@/components/site-header";

type Region = "EU" | "UK" | "US";

// Minimal client wrapper to satisfy SiteHeader props for this page
export function BecomeCoachHeader() {
  const router = useRouter();
  const [region, setRegion] = useState<Region>("UK");

  const handleNavigate = (page: string) => {
    if (page === "home") {
      router.push("/");
    } else {
      router.push(`/${page}` as Route);
    }
  };

  return (
    <SiteHeader
      onNavigate={handleNavigate}
      region={region}
      setRegion={setRegion}
    />
  );
}

