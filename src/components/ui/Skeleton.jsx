// src/components/ui/Skeleton.jsx
import React from "react";

/**
 * Shape-matched loading placeholders. The old site showed a bare "Loading…"
 * line and then snapped the layout into place; these hold the real geometry so
 * nothing jumps when data lands.
 */
export function Skeleton({ className = "", ...rest }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-ink-100 ${className}`}
      {...rest}
    >
      <span className="absolute inset-0 -translate-x-full animate-shimmer bg-sheen" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="surface overflow-hidden">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TextSkeleton({ lines = 3 }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3.5"
          style={{ width: `${100 - i * 12}%` }}
        />
      ))}
    </div>
  );
}

export default Skeleton;
