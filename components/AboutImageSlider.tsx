"use client";

import { useCallback, useEffect, useState } from "react";
import ImageWithFallback from "./ImageWithFallback";

const AUTO_ROTATE_MS = 5000;

export default function AboutImageSlider({
  ownerImage,
  shopImages,
  ownerName,
  ownerRole,
}: {
  ownerImage: string;
  shopImages: string[];
  ownerName: string;
  ownerRole: string;
}) {
  const images = [ownerImage, ...shopImages];
  const [index, setIndex] = useState(0);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const id = setInterval(goNext, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [goNext]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl shadow-lg">
        {images.map((src, i) => (
          <div
            key={i}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <ImageWithFallback
              src={src}
              alt=""
              className="h-full w-full bg-neutral-200 object-cover"
            />
            {i === 0 && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent p-5 pt-14">
                <p className="font-heading text-lg font-bold text-white">{ownerName}</p>
                <p className="font-body text-sm text-white/80">{ownerRole}</p>
              </div>
            )}
          </div>
        ))}

        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === index ? "bg-accent" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            aria-label={`View photo ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={`overflow-hidden rounded-lg transition-all ${
              i === index ? "ring-2 ring-accent ring-offset-2" : "opacity-80 hover:opacity-100"
            }`}
          >
            <ImageWithFallback
              src={src}
              alt=""
              className="aspect-square w-full bg-neutral-200 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
