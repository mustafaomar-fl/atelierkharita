"use client";

import { type FormEvent, type ReactNode, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { slugifyCategory, type Service } from "@/lib/services";
import { LocationIcon } from "./icons";

type FormState = {
  name: string;
  phone: string;
  dropOffTime: string;
  services: string[];
  description: string;
  termsAccepted: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  name: "",
  phone: "",
  dropOffTime: "",
  services: [],
  description: "",
  termsAccepted: false,
};

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-paper/95 px-4 py-3 font-body text-sm text-ink shadow-sm transition-all placeholder:text-primary-light/65 focus:-translate-y-0.5 focus:bg-paper focus:outline-none focus:ring-4 focus:ring-accent/15 ${
    hasError ? "border-red-400" : "border-primary/15 focus:border-accent"
  }`;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-body text-sm font-semibold text-white">{label}</span>
      {children}
      {error && <span className="text-sm text-red-400">{error}</span>}
    </label>
  );
}

function CheckboxCard({
  checked,
  onChange,
  children,
  checkedTextClass = "text-neutral-700/80",
}: {
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  checkedTextClass?: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 font-body text-sm transition-all ${
        checked
          ? "border-accent bg-accent/10 shadow-sm"
          : "border-primary/10 bg-paper/95 hover:border-accent/60 hover:bg-white hover:shadow-sm"
      }`}
    >
      <span
        className={`relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
          checked ? "border-primary bg-primary" : "border-neutral-300 bg-white"
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        {checked && (
          <svg
            viewBox="0 0 16 16"
            className="h-3 w-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8.5l3 3 7-7" />
          </svg>
        )}
      </span>
      <span className={checked ? checkedTextClass : "text-neutral-700/80"}>{children}</span>
    </label>
  );
}

function TermsLabel({
  label,
  termsLink,
  privacyLink,
}: {
  label: string;
  termsLink: string;
  privacyLink: string;
}) {
  const [before, afterTerms] = label.includes(termsLink)
    ? label.split(termsLink)
    : [label, null];

  if (afterTerms === null) {
    return <>{label}</>;
  }

  const [between, after] = afterTerms.includes(privacyLink)
    ? afterTerms.split(privacyLink)
    : [afterTerms, null];

  return (
    <>
      {before}
      <Link href="/terms" className="font-semibold text-primary underline hover:text-accent-dark">
        {termsLink}
      </Link>
      {after === null ? (
        between
      ) : (
        <>
          {between}
          <Link
            href="/privacy"
            className="font-semibold text-primary underline hover:text-accent-dark"
          >
            {privacyLink}
          </Link>
          {after}
        </>
      )}
    </>
  );
}

export default function BookingForm({
  location1,
  location2,
}: {
  location1: string;
  location2: string;
}) {
  const t = useTranslations("booking");
  const tGlobal = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const services = tGlobal.raw("services") as Service[];

  const [form, setForm] = useState<FormState>(() => {
    const preselect = searchParams.get("service");
    if (!preselect) return initialState;
    const matches = services.filter((s) => slugifyCategory(s.category) === preselect);
    return matches.length > 0
      ? { ...initialState, services: matches.map((s) => s.id) }
      : initialState;
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function toggleService(id: string) {
    setForm((f) => ({
      ...f,
      services: f.services.includes(id)
        ? f.services.filter((s) => s !== id)
        : [...f.services, id],
    }));
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = t("errorRequired");
    if (!form.phone.trim()) next.phone = t("errorRequired");
    else if (!/^[+\d][\d\s()-]{5,}$/.test(form.phone.trim())) next.phone = t("errorRequired");
    if (!form.dropOffTime) next.dropOffTime = t("errorRequired");
    if (!form.termsAccepted) next.termsAccepted = t("errorRequired");
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      if (!res.ok) throw new Error("request_failed");
      const data = (await res.json()) as { id: string };
      setBookingId(data.id);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (bookingId) {
    return (
      <div className="bg-white px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-md rounded-lg border border-primary/10 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="font-body text-lg text-neutral-700/80">{t("successMessage")}</p>
          <p className="mt-4 font-body text-sm text-neutral-500/80">
            Booking ID: <span className="font-semibold text-primary">{bookingId}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-2xl">
          <span className="mb-4 block h-1 w-12 rounded-full bg-accent" aria-hidden="true" />
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
            Atelier Kharita · Booking
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight text-primary sm:text-5xl">
            {t("heading")}
          </h1>
        </div>

        <div className="panel-navy overflow-hidden rounded-2xl shadow-xl shadow-primary/15">
          <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="flex flex-col justify-between border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
              <div>
                <p className="font-heading text-2xl text-accent">{t("repairTagline")}</p>
              </div>
              <div className="mt-10 rounded-xl border border-accent/25 bg-primary-dark/30 p-4">
                <span className="mb-2 flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  <LocationIcon className="h-4 w-4 shrink-0" />
                  {t("locationsLabel")}
                </span>
                <ul className="flex flex-col gap-1 font-body text-sm leading-6 text-paper/75">
                  {location1 && <li>{location1}</li>}
                  {location2 && <li>{location2}</li>}
                </ul>
              </div>
            </aside>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7 bg-white/5 p-6 sm:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label={t("nameLabel")} error={errors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={inputClass(!!errors.name)}
                />
              </Field>

              <Field label={t("phoneLabel")} error={errors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputClass(!!errors.phone)}
                />
              </Field>
            </div>

            <Field label={t("dropOffLabel")} error={errors.dropOffTime}>
              <input
                type="datetime-local"
                value={form.dropOffTime}
                onChange={(e) => update("dropOffTime", e.target.value)}
                className={inputClass(!!errors.dropOffTime)}
              />
            </Field>

            <div>
              <span className="mb-3 block font-body text-sm font-semibold text-white">
                {t("servicesLabel")}
              </span>
              <div className="grid gap-2 sm:grid-cols-2">
                {services.map((service) => (
                  <CheckboxCard
                    key={service.id}
                    checked={form.services.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                    checkedTextClass="text-paper/90"
                  >
                    {service.category} — {service.item} (from &euro;{service.price}
                    {service.priceUnit !== "flat" ? ` ${service.priceUnit}` : ""})
                  </CheckboxCard>
                ))}
              </div>
            </div>

            <Field label={t("descriptionLabel")}>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                className={inputClass(false)}
              />
            </Field>

            <div>
              <CheckboxCard
                checked={form.termsAccepted}
                onChange={() => update("termsAccepted", !form.termsAccepted)}
              >
                <TermsLabel
                  label={t("termsLabel")}
                  termsLink={t("termsLink")}
                  privacyLink={t("privacyLink")}
                />
              </CheckboxCard>
              {errors.termsAccepted && (
                <p className="mt-1.5 text-sm text-red-400">{errors.termsAccepted}</p>
              )}
            </div>

            {submitError && (
              <p className="text-sm text-red-400">Something went wrong — please try again.</p>
            )}

            <button
              type="submit"
              disabled={!form.termsAccepted || submitting}
              className="w-full rounded-md bg-accent px-8 py-3.5 font-button text-sm font-normal text-primary shadow-sm transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:self-start"
            >
              {t("confirmButton")}
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
