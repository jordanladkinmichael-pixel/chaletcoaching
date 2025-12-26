"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  helperText?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({
  label,
  helperText,
  checked,
  onCheckedChange,
  className,
  id,
  disabled,
  ...props
}: SwitchProps) {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={switchId}
          className="text-sm font-medium text-text"
        >
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={label ? switchId : undefined}
          disabled={disabled}
          onClick={() => !disabled && onCheckedChange(!checked)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
            checked ? "bg-ai" : "bg-surface-hover",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <motion.span
            layout
            transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white",
              checked ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
        <input
          type="checkbox"
          id={switchId}
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <span className="text-sm text-text-muted">
          {checked ? "On" : "Off"}
        </span>
      </div>
      {helperText && (
        <p className="text-xs text-text-subtle">{helperText}</p>
      )}
    </div>
  );
}

