"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const AUTO_ROTATE_MS = 4000;

export default function FooterImageSlider() {
  const t = useTranslations("footer");
  const images = t.raw("images") as string[];
  const [index, setIndex] = useState(0);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(goNext, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [goNext, images.length]);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-white/20 bg-primary-dark/50">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === index ? "bg-accent" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
