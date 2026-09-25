import type { Metadata } from "next";
import { Alegreya, Familjen_Grotesk } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import { extractLatLngFromEmbedSrc, extractMapEmbedSrc } from "@/lib/mapEmbed";
import { readSettings, toTelHref } from "@/lib/settings";
import type { Service } from "@/lib/services";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "../globals.css";

const alegreya = Alegreya({
  variable: "--font-alegreya",
  subsets: ["latin"],
});

const familjenGrotesk = Familjen_Grotesk({
  variable: "--font-familjen",
  subsets: ["latin"],
});

const OG_LOCALES: Record<string, string> = { en: "en_US", nl: "nl_NL", ar: "ar_AR" };

function localizedPaths(path: string) {
  return Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "meta" });
  const title = meta("title");
  const description = meta("description");

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: { ...localizedPaths(""), "x-default": `${SITE_URL}/${routing.defaultLocale}` },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      siteName: "Atelier Kharita",
      locale: OG_LOCALES[locale] ?? locale,
      type: "website",
      images: [{ url: "/images/logo.png", width: 500, height: 500 }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: ["/images/logo.png"],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const dir = locale === "ar" ? "rtl" : "ltr";

  const t = await getTranslations({ locale });
  const settings = await readSettings();
  const services = t.raw("services") as Service[];

  const mapEmbedSrc = extractMapEmbedSrc(settings.mapEmbedUrl);
  const geo = mapEmbedSrc ? extractLatLngFromEmbedSrc(mapEmbedSrc) : null;
  const sameAs = [settings.social.instagram, settings.social.tiktok, settings.social.whatsapp].filter(
    (link) => link && link.trim() !== "" && link.trim() !== "#"
  );

  // LocalBusiness structured data: this is what actually lets a search
  // engine connect "replace zipper" or "fix jacket" queries to this
  // business specifically, rather than relying on the visible page text
  // alone — each service is listed as its own Offer, in whichever
  // language the page is being rendered in.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: "Atelier Kharita",
    description: t("meta.description"),
    url: `${SITE_URL}/${locale}`,
    telephone: toTelHref(settings.phone).replace("tel:", ""),
    priceRange: "€€",
    image: `${SITE_URL}/images/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.location1,
      addressLocality: "Beverwijk",
      addressCountry: "NL",
    },
    ...(geo && {
      geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng },
    }),
    ...(sameAs.length > 0 && { sameAs }),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Tailoring & alteration services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: `${service.category} — ${service.item}` },
        price: service.price,
        priceCurrency: "EUR",
      })),
    },
  };

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${alegreya.variable} ${familjenGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
