import Topbar from "@/components/admin/Topbar";
import PromoCodesContent from "@/components/admin/promo-codes/PromoCodesContent";

export default function PromoCodesPage() {
  return (
    <>
      <Topbar
        title="Promo Codes"
        description="Influencer and partner codes, and the course purchases each one has brought in."
      />
      <div className="space-y-6 p-4 sm:p-6">
        <PromoCodesContent />
      </div>
    </>
  );
}
