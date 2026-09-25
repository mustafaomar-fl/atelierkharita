# Atelier Kharita — Project Overview

_Generated 2026-09-23, updated 2026-09-23._

## What this project is

A multilingual (EN / NL / AR) marketing + booking website for **Atelier Kharita**, a tailoring and alterations studio run by Tarek Kharita, with a pitch of "Clothes live longer." Visitors browse services/prices, submit a drop-off booking, and the owner manages incoming bookings, prices, page copy, and images through a password-protected admin dashboard.

Built with **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS v4**, **next-intl** (i18n), **nodemailer** (email), and **sharp** (image processing). No database — content, prices, and bookings all live as JSON files on disk, edited directly by the admin dashboard's API routes.

> Note on `AGENTS.md`: the "This is NOT the Next.js you know" block is auto-generated/re-written by `next dev` itself (see `node_modules/next/dist/server/lib/generate-agent-files.js`) — it's tooling boilerplate for a pre-release Next.js version, not custom project documentation.

## Status of this document

This file was produced by reading the current codebase — there is **no git repository** and no saved assistant memory for this project, so there's no history to draw a changelog from. It describes what exists today. No application code was changed to produce it.

---

## 1. Public site — pages and components

### Layout (`app/[locale]/layout.tsx`)
Wraps every public page with `Navbar` + page content + `Footer`, sets `<html lang dir>` per locale (`dir="rtl"` automatically for `ar`), loads three Google fonts (Alegreya, Familjen Grotesk, Sen) as CSS variables, and builds `<title>`/`<meta description>` from each locale's `meta` strings.

### Navbar (`components/Navbar.tsx`)
Sticky top bar: logo + "Atelier Kharita" wordmark linking home, "Home" / "Book a Session" links, the locale switcher, a standalone "Book a Session" pill button, and a hamburger menu on mobile that expands into a stacked nav.

### LocaleSwitcher (`components/LocaleSwitcher.tsx`)
Three-way `EN / NL / AR` switcher that swaps the locale segment of the current URL in place (keeps the visitor on the same page in the new language).

### Hero (`components/Hero.tsx`)
Full-width intro banner: headline + "Book a session" / "Check services and prices" buttons on one side, an auto-rotating (6s) before/after image carousel on the other, built from the three hero slides' `before`/`after` image pairs, each labeled "Before"/"After" with manual prev/next arrows and dot indicators.

### Testimonials (`components/Testimonials.tsx`)
Horizontally auto-scrolling (5s) carousel of customer review cards — avatar, name, comment, 1–5 star rating — with manual arrow controls; scroll direction flips correctly in RTL (Arabic).

### About (`components/About.tsx` + `AboutImageSlider.tsx`)
Owner bio section: auto-rotating (5s) photo slider (owner photo + 3 shop photos) with thumbnail strip, next to a pull-quote-styled paragraph about Tarek Kharita and his background, plus Instagram/Facebook/WhatsApp icon links (a link is only shown if it's a real URL, not the `#` placeholder).

### Prices (`components/Prices.tsx`)
Services grouped by category (Pants, Blazer/Coat/Jacket, Curtains, Dress/Skirt/Blouse) into per-category price tables, each with a "Book this service" button that deep-links to `/book?service=<category-slug>` and pre-selects that category's services on the booking form.

### CTA (`components/CTA.tsx`)
Closing banner listing every service category as pill badges over a primary→accent gradient, with a headline and a "Book fixing session" button.

### Footer (`components/Footer.tsx` + `FooterImageSlider.tsx`)
Three-column footer: logo/tagline/phone/KVK number/both shop addresses/opening-hours note; an auto-rotating (4s) photo slider; and an embedded Google Maps iframe (built from a validated embed URL — see `lib/mapEmbed.ts`).

### Booking page (`app/[locale]/book/page.tsx` + `components/BookingForm.tsx`)
The booking form: name, phone (validated format), drop-off datetime, a checkbox grid of every service (pre-selectable via `?service=` query param from the Prices section), free-text description, and a required Terms & Privacy checkbox (with inline links into those pages). On submit it `POST`s to `/api/bookings`; success shows a confirmation screen with the generated booking ID; failure shows an inline retry message. Field-level validation runs before submit.

### Privacy Policy & Terms pages (`app/[locale]/privacy`, `/terms`)
Full draft legal pages (English only, not localized) — see the **Legal pages** content section below. Both are explicitly flagged in-page as **drafts requiring legal review**, not finished legal text.

### `ImageWithFallback` (`components/ImageWithFallback.tsx`)
Shared `<img>` wrapper used across sliders: hides or collapses its box if the image 404s, including images that were already broken/cached before the component mounted (handles the case `onError` alone would miss).

### `icons.tsx`
Inline SVG icon set used throughout: chevron, star (filled/outline), location pin, Instagram, Facebook, WhatsApp.

---

## 2. Admin dashboard (`/admin`, Arabic-only UI)

Everything under `/admin` is rendered in Arabic regardless of site locale — it's the owner's operating interface, separate from the public multilingual site.

### Auth
- **Sign-in** (`/admin/sign-in`): single password field, posts to `/api/admin/login`.
- **Session**: a signed, stateless HMAC-SHA256 token (Web Crypto, so it works in both Edge middleware and Node API routes) stored in an `httpOnly` cookie, 8-hour expiry (`lib/adminAuth.ts`).
- **Route protection**: `proxy.ts` (the Next.js middleware) blocks any `/admin/*` route except `/admin/sign-in` unless the session cookie verifies, redirecting to sign-in otherwise. Since middleware doesn't cover `/api/*`, every `/api/admin/*` route independently re-checks the cookie via `isAdminRequest()`.
- **Brute-force protection**: in-memory, per-IP login rate limiter — 5 failed attempts within 15 minutes locks that IP out for 15 minutes (`lib/loginRateLimit.ts`). Resets on server restart; single-instance only, matching the rest of the app's storage model.
- **Logout**: clears the cookie (`/api/admin/logout`).

### Dashboard shell (`app/admin/(dashboard)/layout.tsx`)
Top nav bar with four tabs — **الطلبات** (Orders), **الأسعار** (Prices), **الصور** (Images), **النصوص والبيانات الوصفية** (Content & metadata) — and a logout button. `/admin` itself redirects to `/admin/orders`.

### Orders (`/admin/orders` + `OrdersTable.tsx`)
Lists every booking from `data/bookings.json`, newest first, with submitted date, name, phone, drop-off time, requested services, description, and a status control (`received → confirmed / done`, with optimistic UI + rollback on failure) plus a delete action (confirm dialog, optimistic + rollback). Page is force-dynamic so it always reflects the current file.

### Prices (`/admin/prices` + `PricesEditor.tsx`)
Per-category tables of every service with editable price and unit ("flat" / "per meter" / etc.) and a per-row Save button. Category/item **names** are read from `messages/en.json` and are edit-only-by-file (not exposed in this UI); price edits made here are written to **all three** locale files at once, so EN/NL/AR prices always stay in sync.

### Images (`/admin/images` + `ImagesManager.tsx`)
A fixed catalogue of every image slot on the site (`lib/imageSlots.ts` — logo, 6 hero before/afters, 4 testimonial avatars, owner + 3 shop photos, 3 footer photos), grouped by section. Each slot shows the current image and a drag/click upload; `POST /api/admin/upload` re-encodes the uploaded file with `sharp` (auto-rotate, resize to fit within 2400px, JPEG q85 or PNG level 9 depending on the slot) and overwrites the exact path the site already references — so any format in, correct format out, no code changes needed.

### Content (`/admin/content` + `ContentEditor.tsx`)
Per-locale (EN/NL/AR tabs) editor for hero title/buttons/slide subtitles, about text (owner name/role/bio paragraph/social links), all 4 testimonials (name/comment/rating), footer fields (tagline, phone, KVK, both addresses, hours note, "find us" heading, Google Maps embed URL/snippet), CTA line/button, and page `<title>`/meta description. `PATCH /api/admin/content` server-side validates every field (non-empty strings, testimonial rating 1–5, map URL must resolve to an allowed `google.com/maps/embed` URL via `lib/mapEmbed.ts`) before writing the corresponding `messages/<locale>.json`.

---

## 3. API routes

| Route | Method(s) | Purpose |
|---|---|---|
| `app/api/bookings/route.ts` | `POST` | Public booking submission: validates required fields, appends to `data/bookings.json` via the serialized write queue, then best-effort emails the owner (`atelierkharita@gmail.com`) via SMTP if `EMAIL_SMTP_*` env vars are set — otherwise logs a warning and still saves the booking. |
| `app/api/admin/login/route.ts` | `POST` | Checks password (constant-time compare) against `ADMIN_PASSWORD`, rate-limited by IP, issues the session cookie. |
| `app/api/admin/logout/route.ts` | `POST` | Clears the session cookie. |
| `app/api/admin/bookings/route.ts` | `PATCH`, `DELETE` | Admin-only: update a booking's status or delete it. |
| `app/api/admin/services/route.ts` | `PATCH` | Admin-only: update one service's price/unit across all three locale files. |
| `app/api/admin/content/route.ts` | `PATCH` | Admin-only: validate and overwrite one locale's editable copy fields. |
| `app/api/admin/upload/route.ts` | `POST` | Admin-only: accept an image upload for a known slot, process with `sharp`, write into `/public`. |

All admin routes return `401` if the session cookie doesn't verify.

---

## 4. Data & domain model

- **`lib/services.ts`** — `Service` type (`id`, `category`, `item`, `price`, `priceUnit`) plus helpers to slugify a category name (for the `/book?service=` deep link) and group a flat service list by category.
- **`lib/bookings.ts`** — `BookingRecord` type and a JSON-file-backed store (`data/bookings.json`) with an in-memory promise queue (`mutateBookings`) serializing every read-modify-write so concurrent submissions can't clobber each other. Explicitly single-instance only — not safe across multiple server processes.
- **`i18n/routing.ts`** — locales `en`, `nl`, `ar`; default `nl`; `localeDetection: false` — a deliberate choice: this is a Dutch-market-first business, so every first-time visitor lands on `/nl` regardless of browser language, rather than being redirected by `Accept-Language`.
- **`lib/mapEmbed.ts`** — normalizes/validates a Google Maps embed URL or `<iframe>` snippet, allow-listing `www.google.com/maps/embed…` so nothing else can end up as an iframe `src`.
- **`lib/imageSlots.ts`** — the fixed registry of every image path the site references, used by both the upload API and the admin Images UI.

---

## 5. Content inventory — everything on the public site

All of the following exists in **three parallel versions** (`messages/en.json`, `nl.json`, `ar.json`) — full translations, not machine-generated stubs. English shown below as the reference; Dutch and Arabic mirror the same structure with the same values translated (Arabic also switches the whole site to RTL).

### Meta
- **Title:** "Atelier Kharita — Clothes live longer"
- **Description:** "Tailoring and alterations in Beverwijk — expert repairs for trousers, jackets, dresses and curtains. Book your appointment online."

### Navbar
Home · Book a Session · (logo)

### Hero
- Title: **"Clothes live longer"**
- Buttons: "Book a session" / "Check services and prices"
- 3 slides, each an image pair + subtitle:
  1. "Expert alterations for every garment"
  2. "Give your favorite pieces a second life"
  3. "Precision tailoring, done right"

### Testimonials
Section title: "What Our Customers Say". **4 testimonial slots, all still placeholders** — `"[Add real customer name]"` / `"[Add real customer review]"`, ratings pre-set to 5, 5, 4, 5. Not yet populated with real customer reviews.

### About
- Title: "About Us"
- Owner: **Tarek Kharita**, Owner & Master Tailor
- Bio (paraphrased structure — full text lives in the JSON files): 35 years in tailoring, trained and worked in Syria 1990–2015 (own business + sewing workshop), moved to the Netherlands and has since worked with De Bijenkorf Amsterdam and Atelier Shekho on repairs and made-to-measure work. Fluent in Syrian Arabic, good working Dutch and English.
- Social links: Instagram (live link), WhatsApp (live `wa.me` QR link), Facebook (**placeholder `#`, not yet set**).

### Services & Prices
Grouped into 4 categories, 13 line items total:

| Category | Item | Price |
|---|---|---|
| Pants | Shorten | €6 flat |
| Pants | Take in | €10 flat |
| Pants | New zipper | €10 flat |
| Pants | New pockets | €10 flat |
| Blazer, Coat & Jacket | Shorten length | €20 flat |
| Blazer, Coat & Jacket | Take in sides | €20 flat |
| Blazer, Coat & Jacket | Shorten sleeves | €20 flat |
| Blazer, Coat & Jacket | New zipper | €20 flat |
| Curtains | Shorten | €5 per meter |
| Dress, Skirt & Blouse | Shorten | €10 flat |
| Dress, Skirt & Blouse | Take in | €10 flat |
| Dress, Skirt & Blouse | New zipper | €10 flat |
| Dress, Skirt & Blouse | Shorten sleeves | €10 flat |

Section heading: "Services & Prices start from". Prices are explicitly framed sitewide as starting prices, confirmed before work begins (also stated in the Terms page).

### CTA
"Ready to give your clothes a second life?" → "Book fixing session"

### Booking form
Labels: Name, Phone number, Drop-off time, Drop-off locations, Services, Extra description, "I agree to the Terms & Conditions and Privacy Policy" (with inline links), Confirm. Success message: "Thanks — we've received your booking, we'll be in touch to confirm."

### Footer
- Tagline: "Clothes live longer"
- Phone: **06 44469920**
- KVK nr. **42073008**
- Locations: **Bazaar Beverwijk, Hal 25** and **Watermuntstraat 76, 1531 TR Wormer**
- Hours: "Currently open weekends only (Sat–Sun)"
- Embedded Google Map to the Beverwijk location
- 3-photo rotating gallery

### Legal pages (English text only — not translated to NL/AR)

Both pages carry a visible amber "⚠️ Draft for review — this is a starting template, not legal advice" banner and multiple bracketed placeholders (`[KVK number]`, `[date]`, retention periods, etc.) still to be filled in.

**Privacy Policy** — 9 sections: who operates the site (contact: `atelierkharita@gmail.com`, 06 44469920), what's collected via the booking form (name, phone, item type, drop-off time, services, description, timestamp — explicitly no analytics/tracking cookies in use yet), legal basis (contract performance), who data is shared with (hosting/email providers only, no selling), retention (proposed 12 months / 7 years for tax records — flagged as unconfirmed), GDPR/AVG rights + link to Autoriteit Persoonsgegevens, security, policy-change notice, contact.

**Terms & Conditions** — 14 sections: scope, how bookings work (prices are "from" prices, confirmed before work starts), payment (in person only, cash/card, no online payment), collection window (proposed 3 months + 1 month grace before items are considered abandoned — flagged as unconfirmed), turnaround estimates are non-binding, liability (capped at the service price paid, valuables must be removed before drop-off), the 14-day EU right-of-withdrawal waiver for starting work immediately (flagged as needing legal sign-off), cancellations, complaints (proposed 14-day window, 5-business-day response target), force majeure, right to photograph items for marketing (anonymized, opt-out at drop-off), governing law (Dutch), change notice, contact.

---

## 6. Known placeholders / open items

- Testimonials are still template text in all 3 locales — need real customer reviews.
- `about.social.facebook` is `"#"` in all 3 locales — no Facebook page linked yet.
- Privacy Policy and Terms pages are explicitly marked as **drafts needing legal review** before publishing, with several bracketed placeholders (KVK number, dates, retention/collection windows) still unfilled, and are **English-only** (not localized to NL/AR despite the rest of the site being trilingual).
- `.env` is present but its contents weren't read here (SMTP + `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` are required for email notifications and admin login to work — see `.env.example`).

## Running it

```bash
npm run dev     # http://localhost:3000
npm run build
npm run start
npm run lint
```
