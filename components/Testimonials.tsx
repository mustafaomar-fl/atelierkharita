"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronIcon, StarIcon } from "./icons";

type Testimonial = {
  name: string;
  comment: string;
  rating: number;
  avatar: string;
};

const AUTO_SCROLL_MS = 5000;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < rating} />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const testimonials = t.raw("testimonials") as Testimonial[];
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 300) + 24;
    el.scrollBy({
      left: isRtl ? -direction * amount : direction * amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const id = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      const atEnd = isRtl
        ? el.scrollLeft <= -maxScroll + 4
        : el.scrollLeft >= maxScroll - 4;

      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollByCard(1);
      }
    }, AUTO_SCROLL_MS);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRtl, testimonials.length]);

  return (
    <section
      id="testimonials"
      className="bg-neutral-50 px-4 py-16 sm:px-6 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-center font-heading text-2xl font-bold text-primary sm:text-3xl">
          {t("testimonialsTitle")}
        </h2>
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((item, i) => (
            <article
              key={i}
              data-card
              className="flex w-72 shrink-0 snap-start flex-col gap-4 rounded-xl border-t-4 border-accent bg-white p-6 shadow-sm sm:w-80"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-full bg-neutral-200 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
                <span className="font-heading font-semibold text-primary">
                  {item.name}
                </span>
              </div>
              <p className="flex-1 font-body text-sm text-neutral-600/80">
                {item.comment}
              </p>
              <Stars rating={item.rating} />
            </article>
          ))}
        </div>

        {testimonials.length > 1 && (
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              aria-label="Previous testimonials"
              onClick={() => scrollByCard(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <ChevronIcon />
            </button>
            <button
              type="button"
              aria-label="Next testimonials"
              onClick={() => scrollByCard(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <span className="rotate-180">
                <ChevronIcon />
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
