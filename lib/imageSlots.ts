// Every image the admin dashboard can replace, matched to the exact path
// referenced in messages/*.json / components. `format` controls what the
// upload route re-encodes the file to via sharp, so an uploaded PNG/HEIC/etc.
// always lands in the format the site expects, regardless of what was sent.
export type ImageSlot = {
  key: string;
  label: string;
  group: "Branding" | "Hero slider" | "Testimonials" | "About" | "Footer";
  /** Path relative to /public, also the URL path since /public is served at /. */
  path: string;
  format: "jpeg" | "png";
};

export const IMAGE_SLOTS: ImageSlot[] = [
  { key: "logo", label: "Logo", group: "Branding", path: "images/logo.png", format: "png" },

  {
    key: "hero-slide1-before",
    label: "Hero — Slide 1 (Before)",
    group: "Hero slider",
    path: "images/hero/slide1-before.jpg",
    format: "jpeg",
  },
  {
    key: "hero-slide1-after",
    label: "Hero — Slide 1 (After)",
    group: "Hero slider",
    path: "images/hero/slide1-after.jpg",
    format: "jpeg",
  },
  {
    key: "hero-slide2-before",
    label: "Hero — Slide 2 (Before)",
    group: "Hero slider",
    path: "images/hero/slide2-before.jpg",
    format: "jpeg",
  },
  {
    key: "hero-slide2-after",
    label: "Hero — Slide 2 (After)",
    group: "Hero slider",
    path: "images/hero/slide2-after.jpg",
    format: "jpeg",
  },
  {
    key: "hero-slide3-before",
    label: "Hero — Slide 3 (Before)",
    group: "Hero slider",
    path: "images/hero/slide3-before.jpg",
    format: "jpeg",
  },
  {
    key: "hero-slide3-after",
    label: "Hero — Slide 3 (After)",
    group: "Hero slider",
    path: "images/hero/slide3-after.jpg",
    format: "jpeg",
  },

  {
    key: "testimonial-avatar1",
    label: "Testimonial — Avatar 1",
    group: "Testimonials",
    path: "images/testimonials/avatar1.jpg",
    format: "jpeg",
  },
  {
    key: "testimonial-avatar2",
    label: "Testimonial — Avatar 2",
    group: "Testimonials",
    path: "images/testimonials/avatar2.jpg",
    format: "jpeg",
  },
  {
    key: "testimonial-avatar3",
    label: "Testimonial — Avatar 3",
    group: "Testimonials",
    path: "images/testimonials/avatar3.jpg",
    format: "jpeg",
  },
  {
    key: "testimonial-avatar4",
    label: "Testimonial — Avatar 4",
    group: "Testimonials",
    path: "images/testimonials/avatar4.jpg",
    format: "jpeg",
  },

  {
    key: "about-owner",
    label: "About — Owner Photo",
    group: "About",
    path: "images/about/owner.jpg",
    format: "jpeg",
  },
  {
    key: "about-shop1",
    label: "About — Shop Photo 1",
    group: "About",
    path: "images/about/shop1.jpg",
    format: "jpeg",
  },
  {
    key: "about-shop2",
    label: "About — Shop Photo 2",
    group: "About",
    path: "images/about/shop2.jpg",
    format: "jpeg",
  },
  {
    key: "about-shop3",
    label: "About — Shop Photo 3",
    group: "About",
    path: "images/about/shop3.jpg",
    format: "jpeg",
  },

  {
    key: "footer-photo1",
    label: "Footer — Photo 1",
    group: "Footer",
    path: "images/footer/footer1.jpg",
    format: "jpeg",
  },
  {
    key: "footer-photo2",
    label: "Footer — Photo 2",
    group: "Footer",
    path: "images/footer/footer2.jpg",
    format: "jpeg",
  },
  {
    key: "footer-photo3",
    label: "Footer — Photo 3",
    group: "Footer",
    path: "images/footer/footer3.jpg",
    format: "jpeg",
  },
];

export function findImageSlot(key: string): ImageSlot | undefined {
  return IMAGE_SLOTS.find((slot) => slot.key === key);
}
