import { Suspense } from "react";
import BookingForm from "@/components/BookingForm";

export default function BookPage() {
  return (
    <Suspense fallback={null}>
      <BookingForm />
    </Suspense>
  );
}
