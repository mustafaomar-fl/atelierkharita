"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";
import ImageWithFallback from "./ImageWithFallback";

export default function Navbar() {
  const t = useTranslations("navbar");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary/95 text-white shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          aria-label={t("logoAlt")}
          className="flex shrink-0 items-center gap-2 whitespace-nowrap"
        >
          <ImageWithFallback
            src="/images/logo.png"
            alt=""
            className="h-20 w-20 object-contain"
            onMissing="collapse"
          />
          <span className="font-heading text-xl font-bold tracking-wide">
            Atelier Kharita
          </span>
        </Link>

        <nav className="hidden items-center gap-8 font-body text-sm md:flex">
          <Link href="/" className="transition-colors hover:text-accent">
            {t("home")}
          </Link>
          <Link href="/book" className="transition-colors hover:text-accent">
            {t("bookSession")}
          </Link>
          <LocaleSwitcher />
        </nav>

        <div className="hidden md:block">
          <Link
            href="/book"
            className="rounded-md bg-accent px-5 py-2 font-button text-sm font-normal text-primary transition-colors hover:bg-accent-dark"
          >
            {t("bookSession")}
          </Link>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/book"
            className="rounded-md bg-accent px-4 py-1.5 font-button text-sm font-normal text-primary transition-colors hover:bg-accent-dark"
          >
            {t("bookSession")}
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-primary-dark"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-3 pt-3 font-body text-sm">
            <Link href="/" onClick={() => setOpen(false)}>
              {t("home")}
            </Link>
            <Link href="/book" onClick={() => setOpen(false)}>
              {t("bookSession")}
            </Link>
            <div className="border-t border-white/10 pt-3">
              <LocaleSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
