import { getTranslations } from "next-intl/server";
import AboutImageSlider from "./AboutImageSlider";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "./icons";

type Social = { instagram: string; facebook: string; whatsapp: string };

function hasLink(value: string | undefined): value is string {
  return !!value && value.trim() !== "" && value.trim() !== "#";
}

export default async function About() {
  const t = await getTranslations("about");
  const ownerImage = t("ownerImage");
  const shopImages = t.raw("shopImages") as string[];
  const social = t.raw("social") as Social;
  const socialLinks = [
    { href: social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: social.whatsapp, label: "WhatsApp", Icon: WhatsAppIcon },
  ].filter((item) => hasLink(item.href));

  return (
    <section id="about" className="px-4 py-16 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-center font-heading text-2xl font-bold text-primary sm:text-3xl">
          {t("title")}
        </h2>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <AboutImageSlider
            ownerImage={ownerImage}
            shopImages={shopImages}
            ownerName={t("ownerName")}
            ownerRole={t("ownerRole")}
          />

          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-2xl border-s-4 border-accent bg-primary-light/10 ps-8 pe-8 py-8">
              <span
                className="absolute top-2 start-6 font-heading text-7xl leading-none text-accent/25"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p className="relative mt-12 font-body text-base leading-relaxed whitespace-pre-line text-neutral-700/80">
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
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-accent hover:text-primary"
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
