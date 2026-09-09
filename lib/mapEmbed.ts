// The admin "location" field accepts either a bare Google Maps embed URL or
// the full <iframe> snippet Google's "Share > Embed a map" gives you. Both
// get normalized down to just the src URL, and validated against an
// allow-list so a malformed or unrelated value can never end up as an
// iframe src on the live site.

const ALLOWED_HOSTNAME = "www.google.com";
const ALLOWED_PATH_PREFIX = "/maps/embed";

export function extractMapEmbedSrc(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const iframeMatch = trimmed.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  const candidate = iframeMatch ? iframeMatch[1] : trimmed;

  try {
    const url = new URL(candidate);
    if (url.hostname === ALLOWED_HOSTNAME && url.pathname.startsWith(ALLOWED_PATH_PREFIX)) {
      return url.toString();
    }
  } catch {
    // not a valid URL at all
  }
  return null;
}
