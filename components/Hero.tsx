"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Slide = {
  subtitle: string;
  beforeImage: string;
  afterImage: string;
};

function DragHandleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2}>
      <path d="M15 6l6 6-6 6M9 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Hero() {
  const t = useTranslations("hero");
  const slides = t.raw("slides") as Slide[];

  const [slideIndex, setSlideIndex] = useState(0);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const slide = slides[slideIndex];

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  // One deliberate hero-load moment: nudge the divider so it's obvious the
  // photo is draggable, then settle back to center.
  useEffect(() => {
    const steps = [
      setTimeout(() => setPosition(36), 600),
      setTimeout(() => setPosition(64), 1300),
      setTimeout(() => setPosition(50), 2000),
    ];
    return () => steps.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    function handleMove(e: PointerEvent) {
      if (!draggingRef.current) return;
      updateFromClientX(e.clientX);
    }
    function handleUp() {
      draggingRef.current = false;
      setDragging(false);
    }
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [updateFromClientX]);

  function goToSlide(i: number) {
    setSlideIndex(i);
    setPosition(50);
  }

  return (
    <section id="hero" className="panel-navy w-full overflow-hidden border-b border-primary-light/30">
      <div className="mx-auto flex max-w-7xl flex-col lg:min-h-[650px] lg:flex-row lg:items-stretch">
        <div className="flex flex-col justify-center gap-8 px-6 py-16 sm:px-10 sm:py-20 lg:w-[42%] lg:px-16 lg:py-0">
          <div className="flex items-center gap-3 text-xs tracking-[0.22em] text-accent uppercase">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            <span>Atelier Kharita</span>
          </div>
          <div>
            <h1 className="max-w-xl font-heading text-5xl font-bold leading-[0.95] tracking-[-0.03em] text-accent sm:text-6xl lg:text-7xl">
              {t("title")}
            </h1>
            <p className="mt-5 font-body text-base leading-relaxed text-white/90 sm:text-lg">
              {slide?.subtitle}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/book"
              className="rounded-sm bg-accent px-6 py-3.5 text-center font-button text-sm font-semibold text-primary shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-accent-dark sm:text-base"
            >
              {t("bookButton")}
            </Link>
            <a
              href="#prices"
              className="rounded-md border border-white/40 px-6 py-3 text-center font-button text-sm font-normal text-white transition-colors hover:border-white hover:bg-white/10 sm:text-base"
            >
              {t("pricesButton")}
            </a>
          </div>
        </div>

        <div className="flex w-full flex-col justify-center gap-3 py-6 pe-6 ps-6 sm:py-8 sm:pe-10 lg:w-[58%] lg:flex-row lg:items-stretch lg:py-10 lg:pe-12 lg:ps-6">
          {/* Drag to compare before/after within the current example. */}
          <div
            ref={containerRef}
            className="relative min-h-[380px] w-full flex-1 touch-none select-none border border-white/25 bg-primary-dark shadow-2xl sm:min-h-[500px]"
            onPointerDown={(e) => {
              draggingRef.current = true;
              setDragging(true);
              updateFromClientX(e.clientX);
            }}
          >
            <img
              src={slide?.afterImage}
              alt={slide ? `After: ${slide.subtitle}` : ""}
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`,
                transition: dragging ? "none" : "clip-path 700ms ease-out",
              }}
            >
              <img
                src={slide?.beforeImage}
                alt={slide ? `Before: ${slide.subtitle}` : ""}
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden";
                }}
              />
            </div>

            {/* Physically left/right, not start/end — the before/after
                split is a fixed left-to-right convention regardless of page
                direction, so these must not flip in RTL while the image
                split stays put. */}
            <span className="pointer-events-none absolute top-3 left-3 rounded bg-black/50 px-2 py-1 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
              Before
            </span>
            <span className="pointer-events-none absolute top-3 right-3 rounded bg-black/50 px-2 py-1 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
              After
            </span>

            <div
              className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/80"
              style={{ left: `${position}%`, transition: dragging ? "none" : "left 700ms ease-out" }}
            />
            <div
              className="pointer-events-none absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-lg"
              style={{ left: `${position}%`, transition: dragging ? "none" : "left 700ms ease-out" }}
            >
              <DragHandleIcon />
            </div>

            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(position)}
              onChange={(e) => setPosition(Number(e.target.value))}
              aria-label="Drag to compare before and after"
              className="sr-only"
            />
          </div>

          {/* Pick which repair example to compare — real thumbnails, not
              abstract dots, so each example is visible on its own. Below
              the main photo on narrow screens; a column beside it at lg,
              using the width that would otherwise sit empty. */}
          {slides.length > 1 && (
            <div className="grid shrink-0 grid-cols-3 gap-2 pt-2 lg:h-auto lg:w-28 lg:grid-cols-1 lg:grid-rows-3 lg:gap-2 lg:pt-0 lg:ps-2">
              {slides.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Example ${i + 1}`}
                  aria-current={i === slideIndex}
                  onClick={() => goToSlide(i)}
                  className={`relative h-16 w-full overflow-hidden border transition-all sm:h-20 lg:h-full ${
                    i === slideIndex
                      ? "border-accent opacity-100"
                      : "border-white/15 opacity-50 hover:opacity-80"
                  }`}
                >
                  <img
                    src={s.afterImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
