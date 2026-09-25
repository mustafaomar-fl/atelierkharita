import { promises as fs } from "fs";
import path from "path";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { db } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";

const LOCALES = ["en", "nl", "ar"] as const;
type Locale = (typeof LOCALES)[number];

type ContentPayload = {
  locale: Locale;
  hero: { title: string; bookButton: string; pricesButton: string; slideSubtitles: string[] };
  about: { ownerName: string; ownerRole: string; paragraph: string };
  footer: { tagline: string; hoursNote: string; findUsHeading: string };
  meta: { title: string; description: string };
};

function messagesPath(locale: string) {
  return path.join(process.cwd(), "messages", `${locale}.json`);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Partial<ContentPayload> | null;

  if (!body || !LOCALES.includes(body.locale as Locale)) {
    return NextResponse.json({ error: "invalid_locale" }, { status: 400 });
  }

  const locale = body.locale as Locale;
  const [stored] = await db.select().from(siteContent).where(eq(siteContent.locale, locale)).limit(1);
  const raw = stored
    ? JSON.stringify(stored.content)
    : await fs.readFile(messagesPath(locale), "utf-8");
  const data = JSON.parse(raw) as {
    hero: { title: string; bookButton: string; pricesButton: string; slides: { subtitle: string }[] };
    about: { ownerName: string; ownerRole: string; paragraph: string };
    footer: Record<string, string>;
    meta: { title: string; description: string };
  };

  const { hero, about, footer, meta } = body;

  if (
    !hero ||
    !isNonEmptyString(hero.title) ||
    !isNonEmptyString(hero.bookButton) ||
    !isNonEmptyString(hero.pricesButton) ||
    !Array.isArray(hero.slideSubtitles) ||
    hero.slideSubtitles.length !== data.hero.slides.length ||
    !hero.slideSubtitles.every(isNonEmptyString)
  ) {
    return NextResponse.json({ error: "invalid_hero" }, { status: 400 });
  }

  if (
    !about ||
    !isNonEmptyString(about.ownerName) ||
    !isNonEmptyString(about.ownerRole) ||
    !isNonEmptyString(about.paragraph)
  ) {
    return NextResponse.json({ error: "invalid_about" }, { status: 400 });
  }

  if (
    !footer ||
    !isNonEmptyString(footer.tagline) ||
    !isNonEmptyString(footer.hoursNote) ||
    !isNonEmptyString(footer.findUsHeading)
  ) {
    return NextResponse.json({ error: "invalid_footer" }, { status: 400 });
  }

  if (!meta || !isNonEmptyString(meta.title) || !isNonEmptyString(meta.description)) {
    return NextResponse.json({ error: "invalid_meta" }, { status: 400 });
  }

  data.hero.title = hero.title.trim();
  data.hero.bookButton = hero.bookButton.trim();
  data.hero.pricesButton = hero.pricesButton.trim();
  data.hero.slides.forEach((slide, i) => {
    slide.subtitle = hero.slideSubtitles[i].trim();
  });

  data.about.ownerName = about.ownerName.trim();
  data.about.ownerRole = about.ownerRole.trim();
  data.about.paragraph = about.paragraph.trim();

  data.footer.tagline = footer.tagline.trim();
  data.footer.hoursNote = footer.hoursNote.trim();
  data.footer.findUsHeading = footer.findUsHeading.trim();

  data.meta.title = meta.title.trim();
  data.meta.description = meta.description.trim();

  await db.insert(siteContent).values({ locale, content: data }).onConflictDoUpdate({
    target: siteContent.locale,
    set: { content: data, updatedAt: new Date() },
  });
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
