"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Xmark } from "iconoir-react";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/befragung", label: "Befragung" },
  { href: "/media", label: "Medienübersicht" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-300 bg-slate-200 text-lg font-medium text-dark">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center justify-center gap-3 absolute left-4" onClick={closeMobileMenu}>
          <img src="/images/mediomat_logo.png" alt="Medi-o-Mat Logo" className="h-8 w-auto" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-slate-700 font-medium">
              {item.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="absolute right-4 inline-flex items-center justify-center rounded-md p-2 text-dark transition hover:bg-slate-300 md:hidden"
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
        >
          {isMobileMenuOpen ? (
            <Xmark className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {isMobileMenuOpen ? (
        <div id="mobile-navigation" className="border-t border-slate-300 bg-slate-200 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:px-6 lg:px-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="rounded-md px-3 py-2 transition hover:bg-slate-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </nav>
  );
}