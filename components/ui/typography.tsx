import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function H1({ children, className, as: Component = "h1", ...props }: TypographyProps) {
  return (
    <Component
      className={cn(
        "font-space-grotesk text-[48px] sm:text-[52px] lg:text-[56px] font-bold tracking-tight leading-tight",
        className
      )}
      style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function H2({ children, className, as: Component = "h2", ...props }: TypographyProps) {
  return (
    <Component
      className={cn(
        "font-space-grotesk text-[32px] sm:text-[36px] lg:text-[40px] font-semibold tracking-tight leading-tight",
        className
      )}
      style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function H3({ children, className, as: Component = "h3", ...props }: TypographyProps) {
  return (
    <Component
      className={cn(
        "font-space-grotesk text-[24px] sm:text-[26px] lg:text-[28px] font-semibold tracking-tight",
        className
      )}
      style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Paragraph({ children, className, as: Component = "p", ...props }: TypographyProps) {
  return (
    <Component
      className={cn("text-base sm:text-lg leading-relaxed text-text", className)}
      style={{ maxWidth: "66ch" }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Small({ children, className, as: Component = "span", ...props }: TypographyProps) {
  return (
    <Component
      className={cn("text-[13px] sm:text-sm leading-relaxed text-text-muted", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

// Alias for backward compatibility
export const P = Paragraph;

