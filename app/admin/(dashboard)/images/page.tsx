import ImagesManager from "@/components/admin/ImagesManager";
import { IMAGE_SLOTS } from "@/lib/imageSlots";

export default function ImagesPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-primary">الصور</h1>
      <p className="mb-6 text-sm text-neutral-500">
        ارفع صورة لأي عنصر أدناه — ستحل فورًا محل الصورة المعروضة حاليًا على الموقع.
        أي صيغة صورة تعمل؛ يتم تحويلها وتغيير حجمها تلقائيًا.
      </p>
      <ImagesManager slots={IMAGE_SLOTS} />
    </div>
  );
}
