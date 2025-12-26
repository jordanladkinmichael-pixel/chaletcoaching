import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "primary" | "ai";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: "bg-surface-hover text-text border border-border",
    primary: "bg-primary text-on-primary border-none",
    ai: "bg-ai-soft text-ai border border-ai",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

