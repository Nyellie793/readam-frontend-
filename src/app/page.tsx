import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Banner from "@/components/sections/Banner";
import Features from "@/components/sections/Features";
import Videos from "@/components/sections/Videos";
import Tutors from "@/components/sections/Tutors";
import Testimonials from "@/components/sections/Testimonials";
import Stats from "@/components/sections/Stats";
import Pricing from "@/components/sections/Pricing";
import Newsletter from "@/components/sections/Newsletter";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/shared/BackToTop";

export default function Home() {

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="pointer-events-none absolute right-0 top-0 z-0 h-[70vh] w-[70vw] rounded-full bg-blue-100/40 blur-[120px]" />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Banner />
          <Features />
          <Videos />
          <Tutors />
          <Testimonials />
          <Stats />
          <Pricing />
          <Newsletter />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </div>
  );
}