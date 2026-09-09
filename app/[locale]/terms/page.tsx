import type { ReactNode } from "react";

const sections: { title: string; body: ReactNode }[] = [
  {
    title: "1. Who these terms apply to",
    body: (
      <p>
        These terms and conditions apply to every booking made with Atelier
        Kharita, KVK number [KVK number], whether made through the website&apos;s
        booking form or by phone, for alteration, repair, or tailoring services
        on clothing, curtains, and similar items (&ldquo;the service&rdquo;).
      </p>
    ),
  },
  {
    title: "2. Bookings",
    body: (
      <p>
        A booking is submitted through our website form or by phone. We&apos;ll
        treat a submitted booking as a request for an appointment or drop-off
        — we may contact you to confirm, adjust, or clarify details before the
        booking is final. Prices shown on the website are starting prices
        (&ldquo;vanaf&rdquo; / &ldquo;from&rdquo;) for standard work; the final
        price depends on the specific item and the work required, and will be
        confirmed with you before we begin, if it differs from the listed
        starting price.
      </p>
    ),
  },
  {
    title: "3. Payment",
    body: (
      <p>
        Payment is made in person at the time of drop-off or pickup (cash or
        card, as accepted in-store). We do not currently process payments
        online.
      </p>
    ),
  },
  {
    title: "4. Drop-off and collection",
    body: (
      <p>
        Please collect your item(s) within [proposed default: 3 months] of
        the agreed pickup date. If an item isn&apos;t collected within this
        period, we&apos;ll attempt to contact you using the details you
        provided. If we&apos;re unable to reach you or the item remains
        uncollected after a further [proposed default: 1 month], we reserve
        the right to consider the item abandoned and dispose of or donate it,
        without further liability on our part.{" "}
        <span className="italic text-neutral-500">
          [Confirm this timeframe reflects what you actually want to
          enforce.]
        </span>
      </p>
    ),
  },
  {
    title: "5. Turnaround time",
    body: (
      <p>
        Any timeframe we give you for completing work is an estimate, not a
        guaranteed deadline, unless we&apos;ve explicitly agreed otherwise in
        writing.
      </p>
    ),
  },
  {
    title: "6. Liability",
    body: (
      <p>
        We take reasonable care with every item, but alterations and repairs
        carry inherent risk, particularly with older, delicate, or previously
        damaged fabric. Our liability for loss or damage to your item while
        in our care is limited to the price you paid for the service on that
        item, except where damage results from our intent or gross
        negligence. We are not liable for pre-existing damage, wear, or
        defects in the item that were not disclosed to us before work began.
        Please remove any valuables (jewelry, loose items in pockets, etc.)
        before drop-off — we&apos;re not responsible for items left inside
        garments.
      </p>
    ),
  },
  {
    title: "7. Right of withdrawal (cooling-off period)",
    body: (
      <p>
        Under Dutch and EU consumer law, bookings made online are normally
        subject to a 14-day right of withdrawal. By submitting a booking
        through our website and requesting that we begin work on your item,
        you expressly ask us to start the service before the 14-day period
        ends, and you acknowledge that once the service has been fully
        carried out, you lose your right of withdrawal for that service.{" "}
        <span className="italic text-neutral-500">
          [This clause needs a lawyer&apos;s sign-off — it&apos;s meant to
          mirror Article 6:230p BW but the exact wording and whether it fully
          applies to this business model should be verified before
          publishing.]
        </span>
      </p>
    ),
  },
  {
    title: "8. Cancellations",
    body: (
      <p>
        You may cancel or reschedule a booking by contacting us before your
        appointment or drop-off time. We reserve the right to decline or
        cancel a booking — for example, if an item isn&apos;t suitable for
        the requested repair — in which case we&apos;ll let you know as soon
        as possible.
      </p>
    ),
  },
  {
    title: "9. Complaints",
    body: (
      <p>
        If you&apos;re not happy with the work carried out, contact us at{" "}
        <a
          href="mailto:atelierkharita@gmail.com"
          className="underline hover:text-primary"
        >
          atelierkharita@gmail.com
        </a>{" "}
        within [proposed default: 14 days] of collection so we can look into
        it. We aim to respond within [proposed default: 5 business days].
      </p>
    ),
  },
  {
    title: "10. Force majeure",
    body: (
      <p>
        We&apos;re not liable for delays or failure to perform caused by
        circumstances beyond our reasonable control.
      </p>
    ),
  },
  {
    title: "11. Photos",
    body: (
      <p>
        We may photograph items before and after repair for our own records
        and, unless you tell us otherwise, to use anonymously (without your
        name or identifying details) on our website or social media to
        showcase our work. Let us know at drop-off if you&apos;d prefer your
        item not be used this way.
      </p>
    ),
  },
  {
    title: "12. Governing law",
    body: (
      <p>
        These terms are governed by Dutch law. Any disputes will be submitted
        to the competent Dutch court, without prejudice to your rights as a
        consumer under mandatory Dutch or EU law.
      </p>
    ),
  },
  {
    title: "13. Changes to these terms",
    body: (
      <p>
        We may update these terms from time to time. The date at the top
        reflects the most recent update. Bookings already confirmed are
        governed by the terms in place at the time of booking.
      </p>
    ),
  },
  {
    title: "14. Contact",
    body: (
      <p>
        Atelier Kharita —{" "}
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

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">
          ⚠️ Draft for review — this is a starting template, not legal advice.
        </p>
        <p className="mt-2">
          A few clauses here (especially the right-of-withdrawal section on
          Dutch consumer law protections for online bookings) carry real risk
          if worded incorrectly — a customer could argue they&apos;re
          entitled to a refund they shouldn&apos;t be, or you could
          unintentionally waive protections that exist for you. Have this
          reviewed by a legal professional, or start from a template via
          KVK/Ondernemersplein or a service like Firm24, before publishing.
        </p>
      </div>

      <h1 className="mb-2 font-heading text-3xl font-bold text-primary">
        Terms &amp; Conditions — Atelier Kharita
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
