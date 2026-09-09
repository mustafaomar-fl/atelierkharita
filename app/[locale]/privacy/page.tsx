import type { ReactNode } from "react";

const listClass = "flex list-disc flex-col gap-1 ps-5";

const sections: { title: string; body: ReactNode }[] = [
  {
    title: "1. Who we are",
    body: (
      <>
        <p>This website is operated by:</p>
        <div className="mt-2 flex flex-col gap-0.5">
          <span>Atelier Kharita</span>
          <span>[Legal business name / owner&apos;s full name, if different]</span>
          <span>KVK number: [KVK number]</span>
          <span>
            Address: [business address, if you want to publish one — not
            legally required for a sole proprietorship without a public
            storefront, but recommended for trust]
          </span>
          <span>
            Email:{" "}
            <a
              href="mailto:atelierkharita@gmail.com"
              className="underline hover:text-primary"
            >
              atelierkharita@gmail.com
            </a>
          </span>
          <span>
            Phone:{" "}
            <a href="tel:+31644469920" className="underline hover:text-primary">
              06 44469920
            </a>
          </span>
        </div>
        <p className="mt-2">
          Atelier Kharita is the data controller for the personal data
          described in this policy.
        </p>
      </>
    ),
  },
  {
    title: "2. What personal data we collect",
    body: (
      <>
        <p>When you use our booking form, we collect:</p>
        <ul className={listClass}>
          <li>Your name</li>
          <li>Your phone number</li>
          <li>The type of clothing/item you&apos;re booking a repair for</li>
          <li>Your preferred drop-off time</li>
          <li>The service(s) you&apos;ve selected</li>
          <li>Any extra description you provide</li>
          <li>The date and time you submitted the booking</li>
        </ul>
        <p className="mt-2 italic text-neutral-500">
          We do not currently use tracking or analytics cookies on this
          website. [Update this section if you later add Google Analytics,
          Meta Pixel, or similar tools — those require separate cookie
          consent under Dutch/EU law.]
        </p>
      </>
    ),
  },
  {
    title: "3. Why we collect it and our legal basis",
    body: (
      <>
        <p>We use this information to:</p>
        <ul className={listClass}>
          <li>
            Schedule and carry out the alteration/repair service you&apos;ve
            requested (legal basis: performance of a contract with you)
          </li>
          <li>
            Contact you about your booking — confirmations, questions about
            the item, or pickup timing (legal basis: performance of a
            contract / legitimate interest in delivering the service you
            asked for)
          </li>
        </ul>
        <p className="mt-2">
          We do not use your data for marketing or send you promotional
          messages unless you separately opt in to that.
        </p>
      </>
    ),
  },
  {
    title: "4. Who we share it with",
    body: (
      <>
        <p>
          We do not sell or rent your personal data to third parties. We may
          share limited data with:
        </p>
        <ul className={listClass}>
          <li>
            Service providers who help us run this website and receive
            bookings (e.g., our website hosting provider, our email
            provider) — only to the extent needed for them to provide that
            service to us
          </li>
          <li>Authorities, if required by law</li>
        </ul>
        <p className="mt-2 italic text-neutral-500">
          [If you use any specific third-party tools — booking software, an
          accountant, invoicing software — list them here once decided.]
        </p>
      </>
    ),
  },
  {
    title: "5. How long we keep it",
    body: (
      <p>
        We keep booking information for [proposed default: 12 months after
        the service is completed, unless a longer period is required for
        tax/accounting purposes]. Data relating to invoices or payments, if
        any, is kept for 7 years as required by Dutch tax law.{" "}
        <span className="italic text-neutral-500">
          [Confirm this retention period reflects what you actually do —
          this is a placeholder default, not a legal requirement for booking
          data specifically.]
        </span>
      </p>
    ),
  },
  {
    title: "6. Your rights",
    body: (
      <>
        <p>Under the GDPR (AVG), you have the right to:</p>
        <ul className={listClass}>
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Restrict or object to our processing of your data</li>
          <li>Request a copy of your data in a portable format</li>
          <li>Withdraw consent at any time, where processing is based on consent</li>
        </ul>
        <p className="mt-2">
          To exercise any of these rights, contact us at{" "}
          <a
            href="mailto:atelierkharita@gmail.com"
            className="underline hover:text-primary"
          >
            atelierkharita@gmail.com
          </a>
          . If you&apos;re not satisfied with how we&apos;ve handled your
          data, you have the right to lodge a complaint with the Autoriteit
          Persoonsgegevens (
          <a
            href="https://autoriteitpersoonsgegevens.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            autoriteitpersoonsgegevens.nl
          </a>
          ).
        </p>
      </>
    ),
  },
  {
    title: "7. Security",
    body: (
      <p>
        We take reasonable technical and organizational measures to protect
        your personal data against loss or unauthorized access.{" "}
        <span className="italic text-neutral-500">
          [If you want to describe anything specific — e.g., &ldquo;data is
          stored on secure servers within the EU&rdquo; — add it here once
          your hosting setup is finalized.]
        </span>
      </p>
    ),
  },
  {
    title: "8. Changes to this policy",
    body: (
      <p>
        We may update this privacy policy from time to time. The date at the
        top reflects the most recent update.
      </p>
    ),
  },
  {
    title: "9. Contact",
    body: (
      <p>
        Questions about this policy or your data:{" "}
        <a
          href="mailto:atelierkharita@gmail.com"
          className="underline hover:text-primary"
        >
          atelierkharita@gmail.com
        </a>{" "}
        /{" "}
        <a href="tel:+31644469920" className="underline hover:text-primary">
          06 44469920
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">
          ⚠️ Draft for review — this is a starting template, not legal
          advice.
        </p>
        <p className="mt-2">
          It&apos;s built from the Dutch Data Protection Authority&apos;s
          (Autoriteit Persoonsgegevens) published requirements for a privacy
          statement, but every business&apos;s data handling is slightly
          different. Before publishing, fill in the bracketed placeholders
          and have it checked — either by a legal professional or using the
          Autoriteit Persoonsgegevens&apos; own free privacy statement
          generator (autoriteitpersoonsgegevens.nl) — since getting the
          retention period and legal basis wrong is the kind of mistake that
          actually matters if a customer complains.
        </p>
      </div>

      <h1 className="mb-2 font-heading text-3xl font-bold text-primary">
        Privacy Policy — Atelier Kharita
      </h1>
      <p className="mb-10 font-body text-sm text-neutral-500/80">
        Last updated: [date]
      </p>

      <div className="flex flex-col gap-8 font-body text-neutral-700/80">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 font-heading text-lg font-semibold text-primary">
              {section.title}
            </h2>
            {section.body}
          </section>
        ))}
      </div>
    </div>
  );
}
