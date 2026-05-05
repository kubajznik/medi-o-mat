"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Xmark } from "iconoir-react";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "#problemstellung", label: "Unser Problem" },
  { href: "#unsere_rolle", label: "So kommen wir ins Spiel" },
  { href: "#medienauswahl", label: "Wie wir Medien auswählen" },
  { href: "#und_jetzt", label: "Wie es weitergeht" },
  { href: "/befragung", label: "Befragung" },
  { href: "/media", label: "Medienübersicht" },
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const pathname = usePathname();
  const showLogo = pathname !== "/";

  return (
    <nav className="top-0 z-50 sticky bg-[#fde083] border-slate-300 border-b font-medium text-dark text-lg">
      <div className="flex justify-center items-center mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl h-16">
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="left-4 absolute flex justify-center items-center gap-3 cursor-[url('/images/cursor_pink_32x32.png')_7_1,_pointer]"
        >
          { showLogo && <img src="/images/mediomat_logo.png" alt="Medi-o-Mat Logo" className="w-auto h-7 md:auto" /> }
        </Link>

        {/* lg:flex fügt die alte Navbar wieder ein*/}
        <div className="hidden items-center gap-8">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} className="font-medium hover:text-slate-700 transition">
              {item.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex right-4 absolute justify-center items-center hover:bg-slate-300 p-2 rounded-md text-dark transition"
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
        >
          {isMobileMenuOpen ? (
            <Xmark className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {isMobileMenuOpen ? (
        <div id="mobile-navigation" className="right-0 left-0 absolute bg-slate-200 border-slate-300 border-t">
          <div className="flex flex-col gap-2 mx-auto px-4 sm:px-6 lg:px-8 py-3 max-w-6xl">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="hover:bg-slate-300 px-3 py-2 rounded-md transition"
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