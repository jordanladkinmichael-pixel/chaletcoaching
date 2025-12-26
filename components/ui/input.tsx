"use client";

import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function Input({ className, icon, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
          {icon}
        </div>
      )}
      <input
        className={cn(
          "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text",
          "placeholder:text-text-muted",
          "focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 focus:ring-offset-bg",
          "disabled:pointer-events-none disabled:opacity-50",
          icon && "pl-10",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function SearchInput({ className, ...props }: InputProps) {
  return (
    <Input
      icon={<Search size={18} />}
      className={className}
      {...props}
    />
  );
}

