// Pulls real reviews from the business's Google Business Profile via the
// Places API (Place Details, `reviews` field) instead of hand-typed
// testimonials. Requires GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID (see
// .env.example) — both need a Google Cloud project with the Places API
// enabled and billing on, plus the business's actual Place ID. Without
// those set, or if the request fails, callers fall back to the static
// testimonials already in messages/*.json rather than showing nothing.

export type GoogleReview = {
  name: string;
  comment: string;
  rating: number;
  avatar: string;
};

type PlaceDetailsResponse = {
  status: string;
  result?: {
    reviews?: {
      author_name: string;
      profile_photo_url: string;
      rating: number;
      text: string;
      language?: string;
    }[];
    rating?: number;
    user_ratings_total?: number;
  };
};

export function isGoogleReviewsConfigured(): boolean {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACE_ID);
}

// Cached for a day (Next.js `fetch` cache) — Google's Places API terms don't
// allow indefinitely caching review content, but re-fetching on every page
// load isn't necessary either.
const REVALIDATE_SECONDS = 60 * 60 * 24;

export async function fetchGoogleReviews(locale: string): Promise<GoogleReview[] | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return null;

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "reviews,rating,user_ratings_total");
  url.searchParams.set("language", locale);
  url.searchParams.set("key", apiKey);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;

    const data = (await res.json()) as PlaceDetailsResponse;
    if (data.status !== "OK" || !data.result?.reviews) return null;

    return data.result.reviews.map((review) => ({
      name: review.author_name,
      comment: review.text,
      rating: Math.round(review.rating),
      avatar: review.profile_photo_url,
    }));
  } catch {
    return null;
  }
}
