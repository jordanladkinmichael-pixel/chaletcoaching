import { Metadata } from "next";
import { Container } from "@/components/ui";
import BecomeCoachFormClient from "./BecomeCoachFormClient";
import SiteFooter from "@/components/site-footer";
import { BecomeCoachHeader } from "./BecomeCoachHeader";

export const metadata: Metadata = {
  title: "Become a Coach | Chaletcoaching",
  description: "Apply to join and build coach-led courses with AI support.",
};

export default function BecomeACoachPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <BecomeCoachHeader />
      <main className="py-12 md:py-16">
        <Container className="max-w-5xl">
          <BecomeCoachFormClient />
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
