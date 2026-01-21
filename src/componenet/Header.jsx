"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "WhatsApp DP", href: "/" },
  { label: "Business Card", href: "/card-gen" },
];

export default function Header({ tagline }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) => pathname === href;

  return (
    <div className="mb-4 md:mb-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl md:rounded-2xl p-3 md:p-6 text-white shadow-lg md:shadow-xl relative">
      <div className="flex items-center justify-between">
        {/* LEFT: Logo + Title */}
        <div className="flex items-center gap-3">
          <img src="/whiteLogo.png" alt="Next Gen" className="h-8 md:h-10" />
          <div>
            <h1 className="text-base md:text-3xl font-bold leading-none">
              Profile Studio
            </h1>
            <p className="hidden md:block text-blue-100 text-sm">{tagline}</p>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition
                ${
                  isActive(item.href)
                    ? "bg-white text-blue-700 shadow"
                    : "bg-white/20 hover:bg-white/30"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          aria-label="Open menu"
        >
          <span className="sr-only">Open menu</span>

          <div className="flex flex-col justify-between w-4 h-3">
            <span className="block h-[2px] w-full bg-white rounded"></span>
            <span className="block h-[2px] w-full bg-white rounded"></span>
            <span className="block h-[2px] w-full bg-white rounded"></span>
          </div>
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden absolute right-3 top-[68px] w-[200px] bg-white rounded-xl shadow-xl overflow-hidden z-50">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 text-sm font-medium transition
                ${
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
