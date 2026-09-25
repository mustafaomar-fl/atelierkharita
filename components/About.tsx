import { getTranslations } from "next-intl/server";
import { readSettings } from "@/lib/settings";
import AboutImageSlider from "./AboutImageSlider";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "./icons";

function hasLink(value: string | undefined): value is string {
  return !!value && value.trim() !== "" && value.trim() !== "#";
}

export default async function About() {
  const t = await getTranslations("about");
  const ownerImage = t("ownerImage");
  const shopImages = t.raw("shopImages") as string[];
  const settings = await readSettings();
  const socialLinks = [
    { href: settings.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings.social.tiktok, label: "TikTok", Icon: TikTokIcon },
    { href: settings.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings.social.whatsapp, label: "WhatsApp", Icon: WhatsAppIcon },
  ].filter((item) => hasLink(item.href));

  return (
    <section id="about" className="panel-navy px-4 py-20 sm:px-6 sm:py-24 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center gap-3">
          <span className="h-0.5 w-10 bg-accent" aria-hidden="true" />
          <h2 className="text-center font-heading text-2xl font-bold text-accent sm:text-3xl">
            {t("title")}
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <AboutImageSlider
            ownerImage={ownerImage}
            shopImages={shopImages}
            ownerName={t("ownerName")}
            ownerRole={t("ownerRole")}
          />

          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-lg border-s-2 border-accent bg-white/5 ps-8 pe-8 py-8">
              <span
                className="absolute top-2 start-6 font-heading text-7xl leading-none text-accent/25"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p className="relative mt-12 font-body text-base leading-relaxed whitespace-pre-line text-white/85">
                {t("paragraph")}
              </p>
            </div>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-accent hover:bg-accent hover:text-primary"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
