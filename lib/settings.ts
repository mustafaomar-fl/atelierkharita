import { promises as fs } from "fs";
import path from "path";

// Business facts that are the same regardless of which language the visitor
// is reading — phone number, addresses, map, social links. These used to
// live duplicated three times inside messages/en.json, nl.json and ar.json
// (edited separately per language in the admin Content editor), even though
// none of it is actually translatable text. Centralizing it here means the
// owner edits it once and every locale picks up the same values.
const DATA_FILE = path.join(process.cwd(), "data", "settings.json");

export type BusinessSettings = {
  phone: string;
  kvk: string;
  location1: string;
  location2: string;
  mapEmbedUrl: string;
  social: {
    instagram: string;
    facebook: string;
    tiktok: string;
    whatsapp: string;
  };
};

const DEFAULT_SETTINGS: BusinessSettings = {
  phone: "",
  kvk: "",
  location1: "",
  location2: "",
  mapEmbedUrl: "",
  social: { instagram: "", facebook: "", tiktok: "", whatsapp: "" },
};

export async function readSettings(): Promise<BusinessSettings> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<BusinessSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      social: { ...DEFAULT_SETTINGS.social, ...parsed.social },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function writeSettings(settings: BusinessSettings): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(settings, null, 2) + "\n");
}

// Turns a Dutch mobile number as typically written ("06 44469920") into a
// tel: href ("+31644469920"). If the value already looks international
// (starts with +), it's used as-is — this only rewrites the common local
// "0..." format so the admin field can stay simple ("just type the number").
export function toTelHref(phone: string): string {
  const digits = phone.trim();
  if (digits.startsWith("+")) return `tel:${digits.replace(/[\s()-]/g, "")}`;
  const stripped = digits.replace(/[\s()-]/g, "");
  if (stripped.startsWith("0")) return `tel:+31${stripped.slice(1)}`;
  return `tel:${stripped}`;
}

// A plain address string doesn't need its own geocoded pin to be useful as a
// link — Google Maps' search endpoint will resolve free-text queries fine.
export function mapsSearchHref(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
