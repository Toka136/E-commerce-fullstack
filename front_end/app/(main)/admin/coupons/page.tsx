import { getCoupons } from "@/features/couponsManagment/api/couponsServerApi";
import { CouponsManager } from "@/features/couponsManagment/components/CouponsManager";
import { CouponsResponse } from "@/features/couponsManagment/types/coupons";

export default async function AdminCouponsPage() {
  const response = (await getCoupons()) as CouponsResponse;

  return (
    <div className="min-h-screen space-y-6 bg-[#f8f9ff] p-8">
      <CouponsManager coupons={response.data ?? []} />
    </div>
  );
}
