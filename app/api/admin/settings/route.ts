import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { extractMapEmbedSrc } from "@/lib/mapEmbed";
import { readSettings, writeSettings, type BusinessSettings } from "@/lib/settings";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Partial<BusinessSettings> | null;

  if (
    !body ||
    !isNonEmptyString(body.phone) ||
    typeof body.kvk !== "string" ||
    !isNonEmptyString(body.location1) ||
    typeof body.location2 !== "string" ||
    typeof body.mapEmbedUrl !== "string" ||
    !body.social ||
    typeof body.social.instagram !== "string" ||
    typeof body.social.facebook !== "string" ||
    typeof body.social.tiktok !== "string" ||
    typeof body.social.whatsapp !== "string"
  ) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  const trimmedMapUrl = body.mapEmbedUrl.trim();
  if (trimmedMapUrl && !extractMapEmbedSrc(trimmedMapUrl)) {
    return NextResponse.json({ error: "invalid_map_url" }, { status: 400 });
  }

  const current = await readSettings();
  const next: BusinessSettings = {
    ...current,
    phone: body.phone.trim(),
    kvk: body.kvk.trim(),
    location1: body.location1.trim(),
    location2: body.location2.trim(),
    mapEmbedUrl: trimmedMapUrl ? (extractMapEmbedSrc(trimmedMapUrl) ?? "") : "",
    social: {
      instagram: body.social.instagram.trim(),
      facebook: body.social.facebook.trim(),
      tiktok: body.social.tiktok.trim(),
      whatsapp: body.social.whatsapp.trim(),
    },
  };

  await writeSettings(next);

  return NextResponse.json({ ok: true });
}
