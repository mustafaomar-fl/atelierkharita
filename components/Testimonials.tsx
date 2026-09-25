import { getLocale, getTranslations } from "next-intl/server";
import { fetchGoogleReviews } from "@/lib/googleReviews";
import TestimonialsCarousel from "./TestimonialsCarousel";

type Testimonial = {
  name: string;
  comment: string;
  rating: number;
  avatar: string;
};

// Reviews come from the business's Google Business Profile (see
// lib/googleReviews.ts) so they're real customer feedback, not hand-typed
// placeholders someone has to keep updated. If Google isn't configured yet,
// or the request fails, this falls back to the static list in
// messages/*.json rather than showing an empty section.
export default async function Testimonials() {
  const t = await getTranslations();
  const locale = await getLocale();

  const googleReviews = await fetchGoogleReviews(locale);
  const testimonials: Testimonial[] = googleReviews ?? (t.raw("testimonials") as Testimonial[]);

  return (
    <TestimonialsCarousel
      title={t("testimonialsTitle")}
      testimonials={testimonials}
      poweredByGoogle={Boolean(googleReviews)}
      poweredByGoogleLabel={t("testimonialsPoweredByGoogle")}
    />
  );
}
