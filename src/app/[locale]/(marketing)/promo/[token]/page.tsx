import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import PromoStatsContent from "@/components/promo/PromoStatsContent";

// A private page: the token in the URL is the only thing protecting it, so
// it must never be indexed or followed.
export const metadata: Metadata = {
  title: "Promo code stats",
  robots: { index: false, follow: false, nocache: true },
};

export default function PromoStatsPage() {
  // Footer is an async Server Component (it uses next-intl's server
  // getTranslations), so it must be rendered here, from the server page,
  // never from inside the client component below.
  return (
    <>
      <PromoStatsContent />
      <Footer />
    </>
  );
}
