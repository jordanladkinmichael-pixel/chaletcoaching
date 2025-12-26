"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  className?: string;
  onTabChange?: (tabId: string) => void;
}

export function Tabs({
  items,
  defaultTab,
  className,
  onTabChange,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const activeContent = items.find((item) => item.id === activeTab)?.content;

  return (
    <div className={cn("", className)}>
      {/* Tab buttons */}
      <div className="flex gap-2 border-b border-border mb-6">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors duration-fast relative",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-t-lg",
                isActive
                  ? "text-text"
                  : "text-text-muted hover:text-text"
              )}
              aria-selected={isActive}
              role="tab"
            >
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div role="tabpanel">
        {activeContent}
      </div>
    </div>
  );
}

