"use client";

import React from "react";
import Image from "next/image";
import { useLazyLoad } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function LazyImage({
  src,
  alt,
  className,
  width,
  height,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { src: string; width?: number; height?: number }) {
  const [ref, isLoaded] = useLazyLoad();

  return (
    <Image
      ref={ref}
      src={isLoaded ? src : "/placeholder.png"}
      alt={alt || ""}
      className={cn("lazy-load", isLoaded && "loaded", className)}
      width={width}
      height={height}
      {...props}
    />
  );
}

