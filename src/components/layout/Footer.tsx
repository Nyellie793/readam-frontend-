import Link from "next/link";

import {
  ArrowUpRight,
  Mail,
  Phone,
} from "lucide-react";

import {
    FaFacebook,
    FaInstagram,
    FaLinkedinIn,
    FaXTwitter,
  } from "react-icons/fa6";

import Logo from "../shared/Logo";

export default function Footer() {
  return (
    <footer className="bg-[#071B4D] text-white safe-bottom">

      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 lg:grid-cols-5">

          {/* Left */}

          <div className="lg:col-span-2">

            <Logo />

            <p className="mt-6 max-w-sm leading-7 text-gray-300">
              Transforming the future of education with
              an interactive AI-first approach that
              empowers students across Cameroon.
            </p>

            <div className="mt-6 space-y-3 text-gray-300">

              <p>
                ✉ hello@readam.ai
              </p>

              <p>
                📞 +237 679 545 186
              </p>

            </div>

            {/* Socials */}

            <div className="mt-8 flex gap-4">

              <Link
                href="#"
                className="
                flex
                h-10
                w-10

                items-center
                justify-center

                rounded-xl

                bg-blue-900

                transition-all

                hover:-translate-y-1
                hover:bg-orange-500
                "
              >
                <FaFacebook size={18} />
              </Link>

              <Link
                href="#"
                className="
                flex
                h-10
                w-10

                items-center
                justify-center

                rounded-xl

                bg-blue-900

                transition-all

                hover:-translate-y-1
                hover:bg-orange-500
                "
              >
                <FaInstagram size={18} />
              </Link>

              <Link
                href="#"
                className="
                flex
                h-10
                w-10

                items-center
                justify-center

                rounded-xl

                bg-blue-900

                transition-all

                hover:-translate-y-1
                hover:bg-orange-500
                "
              >
                <FaXTwitter size={18} />
              </Link>

              <Link
                href="#"
                className="
                flex
                h-10
                w-10

                items-center
                justify-center

                rounded-xl

                bg-blue-900

                transition-all

                hover:-translate-y-1
                hover:bg-orange-500
                "
              >
                <FaLinkedinIn size={18} />
              </Link>

            </div>

          </div>

          {/* Platform */}

          <div>

            <h3 className="mb-6 font-bold text-orange-500">
              PLATFORM
            </h3>

            <div className="flex flex-col gap-4">

              <Link
                href="#"
                className="transition-all hover:translate-x-1 hover:text-orange-500"
              >
                AI Assistant
              </Link>

              <Link
                href="#"
                className="transition-all hover:translate-x-1 hover:text-orange-500"
              >
                Past Questions
              </Link>

              <Link
                href="#"
                className="transition-all hover:translate-x-1 hover:text-orange-500"
              >
                PDF Library
              </Link>

              <Link
                href="#"
                className="transition-all hover:translate-x-1 hover:text-orange-500"
              >
                Video Courses
              </Link>

            </div>

          </div>

          {/* Company */}

          <div>

            <h3 className="mb-6 font-bold text-orange-500">
              COMPANY
            </h3>

            <div className="flex flex-col gap-4">

              <Link
                href="#"
                className="transition-all hover:translate-x-1 hover:text-orange-500"
              >
                About Us
              </Link>

              <Link
                href="#"
                className="transition-all hover:translate-x-1 hover:text-orange-500"
              >
                Become a Tutor
              </Link>

              <Link
                href="#"
                className="transition-all hover:translate-x-1 hover:text-orange-500"
              >
                Blog
              </Link>

              <Link
                href="#"
                className="transition-all hover:translate-x-1 hover:text-orange-500"
              >
                Contact
              </Link>

            </div>

          </div>

          {/* Support */}

          <div>

            <h3 className="mb-6 font-bold text-orange-500">
              SUPPORT
            </h3>

            <div className="flex flex-col gap-4">

              <Link
                href="#"
                className="transition-all hover:translate-x-1 hover:text-orange-500"
              >
                Help Center
              </Link>

              <Link
                href="#"
                className="transition-all hover:translate-x-1 hover:text-orange-500"
              >
                Terms of Use
              </Link>

              <Link
                href="#"
                className="transition-all hover:translate-x-1 hover:text-orange-500"
              >
                Privacy Policy
              </Link>

              <Link
                href="#"
                className="transition-all hover:translate-x-1 hover:text-orange-500"
              >
                FAQ
              </Link>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div
          className="
          mt-14

          flex

          flex-col
          gap-4

          border-t
          border-blue-900

          pt-8

          text-sm
          text-gray-400

          lg:flex-row
          lg:items-center
          lg:justify-between
          "
        >

          <p>
            © 2026 ReadAm. All rights reserved.
          </p>

          <div className="flex gap-8">

            <Link
              href="#"
              className="hover:text-orange-500 transition"
            >
              Privacy Policy
            </Link>

            <Link
              href="#"
              className="hover:text-orange-500 transition"
            >
              Terms of Service
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}