import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import ContentEditor, { type LocaleContent } from "@/components/admin/ContentEditor";

const LOCALES = ["en", "nl", "ar"] as const;

async function readLocaleContent(locale: string): Promise<LocaleContent> {
  const raw = await fs.readFile(path.join(process.cwd(), "messages", `${locale}.json`), "utf-8");
  const data = JSON.parse(raw);
  return {
    hero: {
      title: data.hero.title,
      bookButton: data.hero.bookButton,
      pricesButton: data.hero.pricesButton,
      slideSubtitles: data.hero.slides.map((s: { subtitle: string }) => s.subtitle),
    },
    about: {
      ownerName: data.about.ownerName,
      ownerRole: data.about.ownerRole,
      paragraph: data.about.paragraph,
      social: {
        instagram: data.about.social?.instagram ?? "",
        facebook: data.about.social?.facebook ?? "",
        whatsapp: data.about.social?.whatsapp ?? "",
      },
    },
    testimonials: data.testimonials.map((t: { name: string; comment: string; rating: number }) => ({
      name: t.name,
      comment: t.comment,
      rating: t.rating,
    })),
    footer: {
      tagline: data.footer.tagline,
      phone: data.footer.phone,
      kvk: data.footer.kvk,
      location1: data.footer.location1,
      location2: data.footer.location2,
      hoursNote: data.footer.hoursNote,
      findUsHeading: data.footer.findUsHeading,
      mapEmbedUrl: data.footer.mapEmbedUrl ?? "",
    },
    cta: { line: data.cta.line, button: data.cta.button },
    meta: { title: data.meta.title, description: data.meta.description },
  };
}

// Always read the message files fresh so this reflects the latest saved edits.
export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const [en, nl, ar] = await Promise.all(LOCALES.map(readLocaleContent));

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-primary">النصوص والبيانات الوصفية</h1>
      <p className="mb-6 text-sm text-neutral-500">
        عدّل نصوص الموقع لكل لغة، وخريطة موقع المتجر، وما يظهر عند مشاركة الموقع أو العثور عليه على
        جوجل. أسماء الخدمات وأسعارها موجودة في صفحة{" "}
        <Link href="/admin/prices" className="underline hover:text-primary">
          الأسعار
        </Link>
        .
      </p>
      <ContentEditor initial={{ en, nl, ar }} />
    </div>
  );
}
