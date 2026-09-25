import { hasLocale } from "next-intl";
import { unstable_noStore as noStore } from "next/cache";
import { getRequestConfig } from "next-intl/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { routing } from "./routing";

function mergeMessages<T extends Record<string, unknown>>(
  fallback: T,
  stored: unknown,
): T {
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return fallback;

  const merged: Record<string, unknown> = { ...fallback };
  for (const [key, value] of Object.entries(stored)) {
    const fallbackValue = merged[key];
    merged[key] =
      fallbackValue &&
      typeof fallbackValue === "object" &&
      !Array.isArray(fallbackValue) &&
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
        ? mergeMessages(fallbackValue as Record<string, unknown>, value)
        : value;
  }

  return merged as T;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  noStore();
  const fallbackMessages = (await import(`../messages/${locale}.json`)).default;
  const [stored] = await db
    .select({ content: siteContent.content })
    .from(siteContent)
    .where(eq(siteContent.locale, locale))
    .limit(1);

  return {
    locale,
    messages: mergeMessages(fallbackMessages, stored?.content),
  };
});
