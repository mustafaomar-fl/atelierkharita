import { readBookings } from "@/lib/bookings";
import OrdersTable from "@/components/admin/OrdersTable";

// This reads data/bookings.json fresh on every request. Without this,
// Next.js statically prerenders the page at build time and it would show
// the same frozen list of bookings forever in production.
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const bookings = (await readBookings()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-primary">الطلبات</h1>
      <OrdersTable bookings={bookings} />
    </div>
  );
}
