import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "nl", "ar"],
  defaultLocale: "nl",
  localePrefix: "always",
  // Without this, a visitor's browser Accept-Language header (or a cookie
  // from a previous visit) takes priority over defaultLocale — someone with
  // an English browser would still land on /en on their first visit. This
  // business is Dutch-market-first, so every fresh visitor should land on
  // /nl regardless of browser language; they can still switch manually.
  localeDetection: false,
});
