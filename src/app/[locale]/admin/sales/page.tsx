import Topbar from "@/components/admin/Topbar";
import SalesByCourseContent from "@/components/admin/sales/SalesByCourseContent";

export default function SalesPage() {
  return (
    <>
      <Topbar
        title="Course Sales"
        description="How many people bought each course, and how many of them came through a promo code."
      />
      <div className="space-y-6 p-4 sm:p-6">
        <SalesByCourseContent />
      </div>
    </>
  );
}
