import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { extractMapEmbedSrc } from "@/lib/mapEmbed";
import FooterImageSlider from "./FooterImageSlider";
import ImageWithFallback from "./ImageWithFallback";

export default async function Footer() {
  const t = await getTranslations("footer");
  const mapEmbedSrc = extractMapEmbedSrc(t("mapEmbedUrl"));

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="flex flex-col gap-2">
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
          <p className="font-body text-white/80">{t("phone")}</p>
          {t("kvk") && <p className="font-body text-white/80">{t("kvk")}</p>}
          <p className="font-body text-white/80">{t("location1")}</p>
           <p className="font-body text-white/80">{t("location2")}</p>
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
