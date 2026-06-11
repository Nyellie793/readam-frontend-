"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="
      fixed
      bottom-6
      right-6

      z-50

      flex
      h-14
      w-14

      items-center
      justify-center

      rounded-full

      bg-orange-500

      text-white

      shadow-xl

      transition-all
      duration-300

      hover:-translate-y-1
      hover:bg-orange-600
      hover:shadow-2xl
      "
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );
}