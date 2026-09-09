"use client";

import { useCallback } from "react";

export default function ImageWithFallback({
  src,
  alt,
  className,
  onMissing = "hide",
}: {
  src: string;
  alt: string;
  className?: string;
  /** "hide" keeps the image's box (visible placeholder area); "collapse" removes it entirely. */
  onMissing?: "hide" | "collapse";
}) {
  const applyMissingState = useCallback(
    (el: HTMLImageElement) => {
      if (onMissing === "collapse") {
        el.style.display = "none";
      } else {
        el.style.visibility = "hidden";
      }
    },
    [onMissing]
  );

  // Handles the case where the image already failed (e.g. cached 404) before
  // this component mounted — the browser won't re-fire `error` for that, so
  // onError alone would miss it.
  const refCallback = useCallback(
    (el: HTMLImageElement | null) => {
      if (el && el.complete && el.naturalWidth === 0) {
        applyMissingState(el);
      }
    },
    [applyMissingState]
  );

  return (
    <img
      ref={refCallback}
      src={src}
      alt={alt}
      className={className}
      onError={(e) => applyMissingState(e.currentTarget)}
    />
  );
}
