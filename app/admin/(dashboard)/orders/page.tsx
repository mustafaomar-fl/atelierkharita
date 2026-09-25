import { listBookings } from "@/lib/bookings";
import OrdersTable from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const bookings = await listBookings();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-primary">الطلبات</h1>
      <OrdersTable bookings={bookings} />
    </div>
  );
}
