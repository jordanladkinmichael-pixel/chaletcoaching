import React from "react";
import { cn } from "@/lib/utils";
import { THEME } from "@/lib/theme";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 font-bold tracking-tight",
        sizeClasses[size],
        className
      )}
      style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
    >
      {/* Pulse line indicator */}
      <div
        className="h-1 w-8 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${THEME.primary} 0%, ${THEME.primaryHover} 100%)`,
          animation: "pulse 2s ease-in-out infinite",
        }}
      />
      {showText && (
        <span>
          Chalet<span style={{ color: THEME.primary }}>coaching</span>
        </span>
      )}
    </div>
  );
}

