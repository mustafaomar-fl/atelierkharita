// The production domain, used to build absolute URLs for the sitemap,
// robots.txt, canonical/hreflang tags, and Open Graph metadata. Falls back to
// localhost so none of that breaks in dev — set NEXT_PUBLIC_SITE_URL once the
// site has a real domain (see .env.example).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
  /\/$/,
  ""
);
