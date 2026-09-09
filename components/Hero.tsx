"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronIcon } from "./icons";

type Slide = {
  subtitle: string;
  beforeImage: string;
  afterImage: string;
};

type HeroImage = {
  src: string;
  label: string;
  subtitle: string;
};

const AUTO_ROTATE_MS = 6000;

export default function Hero() {
  const t = useTranslations("hero");
  const slides = t.raw("slides") as Slide[];

  const images: HeroImage[] = slides.flatMap((slide) => [
    { src: slide.beforeImage, label: "Before", subtitle: slide.subtitle },
    { src: slide.afterImage, label: "After", subtitle: slide.subtitle },
  ]);

  const [index, setIndex] = useState(0);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const id = setInterval(goNext, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [goNext]);

  const current = images[index];

  return (
    <section
      id="hero"
      className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-16 lg:py-20"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full max-w-lg rounded-2xl bg-primary p-6 shadow-lg sm:p-8">
          <h1 className="font-heading text-3xl font-bold text-accent sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 font-body text-base text-white sm:text-lg">
            {current?.subtitle}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/book"
              className="rounded-full bg-accent px-6 py-3 text-center font-button text-sm font-normal text-primary/70 transition-colors hover:bg-accent-dark sm:text-base"
            >
              {t("bookButton")}
            </Link>
            <a
              href="#prices"
              className="rounded-full border-2 border-white px-6 py-3 text-center font-button text-sm font-normal text-white transition-colors hover:bg-white hover:text-primary sm:text-base"
            >
              {t("pricesButton")}
            </a>
          </div>
        </div>

        <div className="relative w-full sm:h-[500px] sm:w-[500px]">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-xl sm:h-full">
            {images.map((image, i) => (
              <div
                key={i}
                aria-hidden={i !== index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === index ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <img
                  src={image.src}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
                <span className="absolute start-4 top-4 rounded bg-black/40 px-2 py-1 text-xs font-semibold tracking-wide text-white uppercase">
                  {image.label}
                </span>
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={goPrev}
                className="absolute start-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50"
              >
                <ChevronIcon />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={goNext}
                className="absolute end-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50"
              >
                <span className="rotate-180">
                  <ChevronIcon />
                </span>
              </button>

              <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to image ${i + 1}`}
                    aria-current={i === index}
                    onClick={() => setIndex(i)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      i === index ? "bg-accent" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
