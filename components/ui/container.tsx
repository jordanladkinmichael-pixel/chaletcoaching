import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "default" | "wide";
}

export function Container({
  children,
  className,
  size = "default",
  ...props
}: ContainerProps) {
  // Default: 1200-1240px max-width (Coach-First Design System)
  // Wide: slightly wider for special cases
  const maxWidthClasses = {
    default: "max-w-[1200px]",
    wide: "max-w-[1240px]",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6",
        maxWidthClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

