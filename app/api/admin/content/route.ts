import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { extractMapEmbedSrc } from "@/lib/mapEmbed";

const LOCALES = ["en", "nl", "ar"] as const;
type Locale = (typeof LOCALES)[number];

type ContentPayload = {
  locale: Locale;
  hero: { title: string; bookButton: string; pricesButton: string; slideSubtitles: string[] };
  about: {
    ownerName: string;
    ownerRole: string;
    paragraph: string;
    social: { instagram: string; facebook: string; whatsapp: string };
  };
  testimonials: { name: string; comment: string; rating: number }[];
  footer: {
    tagline: string;
    phone: string;
    kvk: string;
    location1: string;
    location2: string;
    hoursNote: string;
    findUsHeading: string;
    mapEmbedUrl: string;
  };
  cta: { line: string; button: string };
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

  const filePath = messagesPath(body.locale as string);
  const raw = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(raw) as {
    hero: { title: string; bookButton: string; pricesButton: string; slides: { subtitle: string }[] };
    about: {
      ownerName: string;
      ownerRole: string;
      paragraph: string;
      social: { instagram: string; facebook: string; whatsapp: string };
    };
    testimonials: { name: string; comment: string; rating: number }[];
    footer: Record<string, string>;
    cta: { line: string; button: string };
    meta: { title: string; description: string };
  };

  const { hero, about, testimonials, footer, cta, meta } = body;

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
    !isNonEmptyString(about.paragraph) ||
    !about.social ||
    typeof about.social.instagram !== "string" ||
    typeof about.social.facebook !== "string" ||
    typeof about.social.whatsapp !== "string"
  ) {
    return NextResponse.json({ error: "invalid_about" }, { status: 400 });
  }

  if (
    !Array.isArray(testimonials) ||
    testimonials.length !== data.testimonials.length ||
    !testimonials.every(
      (item) =>
        isNonEmptyString(item?.name) &&
        isNonEmptyString(item?.comment) &&
        typeof item?.rating === "number" &&
        item.rating >= 1 &&
        item.rating <= 5
    )
  ) {
    return NextResponse.json({ error: "invalid_testimonials" }, { status: 400 });
  }

  if (
    !footer ||
    !isNonEmptyString(footer.tagline) ||
    !isNonEmptyString(footer.phone) ||
    typeof footer.kvk !== "string" ||
    !isNonEmptyString(footer.location1) ||
    typeof footer.location2 !== "string" ||
    !isNonEmptyString(footer.hoursNote) ||
    !isNonEmptyString(footer.findUsHeading) ||
    typeof footer.mapEmbedUrl !== "string"
  ) {
    return NextResponse.json({ error: "invalid_footer" }, { status: 400 });
  }

  if (!cta || !isNonEmptyString(cta.line) || !isNonEmptyString(cta.button)) {
    return NextResponse.json({ error: "invalid_cta" }, { status: 400 });
  }

  if (!meta || !isNonEmptyString(meta.title) || !isNonEmptyString(meta.description)) {
    return NextResponse.json({ error: "invalid_meta" }, { status: 400 });
  }

  const trimmedMapUrl = footer.mapEmbedUrl.trim();
  if (trimmedMapUrl && !extractMapEmbedSrc(trimmedMapUrl)) {
    return NextResponse.json({ error: "invalid_map_url" }, { status: 400 });
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
  data.about.social = {
    instagram: about.social.instagram.trim(),
    facebook: about.social.facebook.trim(),
    whatsapp: about.social.whatsapp.trim(),
  };

  data.testimonials.forEach((testimonial, i) => {
    testimonial.name = testimonials[i].name.trim();
    testimonial.comment = testimonials[i].comment.trim();
    testimonial.rating = testimonials[i].rating;
  });

  data.footer.tagline = footer.tagline.trim();
  data.footer.phone = footer.phone.trim();
  data.footer.kvk = footer.kvk.trim();
  data.footer.location1 = footer.location1.trim();
  data.footer.location2 = footer.location2.trim();
  data.footer.hoursNote = footer.hoursNote.trim();
  data.footer.findUsHeading = footer.findUsHeading.trim();
  data.footer.mapEmbedUrl = trimmedMapUrl ? (extractMapEmbedSrc(trimmedMapUrl) ?? "") : "";

  data.cta.line = cta.line.trim();
  data.cta.button = cta.button.trim();

  data.meta.title = meta.title.trim();
  data.meta.description = meta.description.trim();

  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n");

  return NextResponse.json({ ok: true });
}
