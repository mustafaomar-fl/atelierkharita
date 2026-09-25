import { Suspense } from "react";
import BookingForm from "@/components/BookingForm";
import { readSettings } from "@/lib/settings";

export default async function BookPage() {
  const settings = await readSettings();

  return (
    <Suspense fallback={null}>
      <BookingForm location1={settings.location1} location2={settings.location2} />
    </Suspense>
  );
}
