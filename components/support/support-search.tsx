"use client";

import React from "react";
import { SearchInput } from "@/components/ui";
import { Paragraph } from "@/components/ui";

interface SupportSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export function SupportSearch({ value, onChange, resultCount }: SupportSearchProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <label htmlFor="support-search" className="sr-only">
          Search
        </label>
        <SearchInput
          id="support-search"
          placeholder="Search help articles..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Paragraph className="text-sm opacity-70 mb-0">
          Popular: tokens, pricing, preview, dashboard
        </Paragraph>
        
        {value && (
          <div
            aria-live="polite"
            className="text-sm opacity-70"
          >
            Showing {resultCount} {resultCount === 1 ? "article" : "articles"}
          </div>
        )}
      </div>
    </div>
  );
}

