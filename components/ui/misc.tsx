import React from "react";
import { cn } from "@/lib/utils";

export function Pill({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Spinner({
  size = 24,
  className,
  ...props
}: { size?: number } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", className)}
      style={{ width: size, height: size }}
      {...props}
    />
  );
}

export function Quote({
  children,
  className,
  ...props
}: React.QuoteHTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote className={cn("italic", className)} {...props}>
      {children}
    </blockquote>
  );
}

