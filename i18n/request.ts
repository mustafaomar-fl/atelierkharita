import { hasLocale } from "next-intl";
import { unstable_noStore as noStore } from "next/cache";
import { getRequestConfig } from "next-intl/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { routing } from "./routing";

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
    messages: stored?.content ?? fallbackMessages,
  };
});
