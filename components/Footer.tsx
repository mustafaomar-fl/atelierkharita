import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { extractMapEmbedSrc } from "@/lib/mapEmbed";
import { mapsSearchHref, readSettings, toTelHref } from "@/lib/settings";
import FooterImageSlider from "./FooterImageSlider";
import ImageWithFallback from "./ImageWithFallback";

export default async function Footer() {
  const t = await getTranslations("footer");
  const settings = await readSettings();
  const mapEmbedSrc = extractMapEmbedSrc(settings.mapEmbedUrl);

  return (
    <footer className="panel-navy border-t border-accent/40 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3">
        <div className="flex flex-col gap-2.5">
          <Link href="/" className="flex items-center gap-2">
            <ImageWithFallback
              src="/images/logo.png"
              alt=""
              className="h-[150px] w-[150px] object-contain"
              onMissing="collapse"
            />
            <span className="font-heading text-2xl font-bold">Atelier Kharita</span>
          </Link>
          <p className="font-body text-white/80">{t("tagline")}</p>
          {settings.phone && (
            <a
              href={toTelHref(settings.phone)}
              className="font-body text-white/80 underline-offset-2 transition-colors hover:text-accent hover:underline"
            >
              {settings.phone}
            </a>
          )}
          {settings.kvk && <p className="font-body text-white/80">{settings.kvk}</p>}
          {settings.location1 && (
            <a
              href={mapsSearchHref(settings.location1)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-white/80 underline-offset-2 transition-colors hover:text-accent hover:underline"
            >
              {settings.location1}
            </a>
          )}
          {settings.location2 && (
            <a
              href={mapsSearchHref(settings.location2)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-white/80 underline-offset-2 transition-colors hover:text-accent hover:underline"
            >
              {settings.location2}
            </a>
          )}
          <p className="font-body text-white/80">{t("hoursNote")}</p>
        </div>

        <div>
          {/* Matches the height of the "find us" heading in the next column so both boxes align */}
          <div className="h-7" aria-hidden="true" />
          <div className="mt-2">
            <FooterImageSlider />
          </div>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold">{t("findUsHeading")}</h3>
          {mapEmbedSrc ? (
            <iframe
              src={mapEmbedSrc}
              title={t("findUsHeading")}
              loading="lazy"
              className="mt-2 aspect-square w-full rounded-lg border border-white/20"
            />
          ) : (
            <div className="mt-2 flex aspect-square w-full items-center justify-center rounded-lg border border-white/20 bg-primary-dark/50 text-sm text-white/50">
              Map embed (placeholder)
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
