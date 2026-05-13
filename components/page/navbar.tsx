"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Xmark, Arcade, SunLight, HalfMoon  } from "iconoir-react";
import { THEMES } from "@/types/storage";
import { useTheme } from "@/context/ThemeContext";
import { useKeyboardHandler } from "@/context/KeyboardContext";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "#problemstellung", label: "Problem" },
  { href: "#unsere_rolle", label: "Wir" },
  { href: "#medienauswahl", label: "Medienauswahl" },
  { href: "#und_jetzt", label: "Weiter" },
  { href: "/befragung", label: "Befragung" },
  { href: "/media", label: "Medienübersicht" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const pathname = usePathname();
  const showLogo = pathname !== "/";

  const { setTheme } = useTheme();

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    setFocusedIndex(0);
    requestAnimationFrame(() => {
      itemRefs.current[0]?.focus();
    });
  }, [isMobileMenuOpen]);

  useKeyboardHandler({
    enabled: true,
    onKey: (event, action) => {
      if (action.type === "button" && action.button === "yellow") {
        setIsMobileMenuOpen(true);
        return true;
      }
      return false;
    }
  })

  useKeyboardHandler({
    enabled: isMobileMenuOpen,
    priority: 100,
    onKey: (event, action) => {
      if (!isMobileMenuOpen) return false;

      const maxIndex = itemRefs.current.length - 1;
      if (maxIndex < 0) return false;

      const focusAt = (nextIndex: number) => {
        const clamped = Math.min(Math.max(nextIndex, 0), maxIndex);
        setFocusedIndex(clamped);
        itemRefs.current[clamped]?.focus();
      };

      if (action.type === "button" && action.button === "yellow") {
        setIsMobileMenuOpen(false);
        return true;
      }

      if (action.type === "nav") {
        if (action.direction === "left" || action.direction === "up") {
          focusAt(focusedIndex - 1);
          return true;
        }
        if (action.direction === "right" || action.direction === "down") {
          focusAt(focusedIndex + 1);
          return true;
        }
      }

      if (action.type === "confirm" || (action.type === "button" && action.button === "green")) {
        itemRefs.current[focusedIndex]?.click();
        return true;
      }

      if (action.type === "escape" || (action.type === "button" && action.button === "red")) {
        closeMobileMenu();
        return true;
      }

      if (action.type === "button") {
        return true;
      }

      return false;
    },
  });

  return (
    <nav className="top-0 z-50 sticky bg-navbar-bg border-surface border-b font-medium text-dark text-lg">
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
        <div id="mobile-navigation" className="right-0 left-0 absolute bg-surface border-slate-300 border-t">
          <div className="flex flex-row gap-2 mx-auto px-4 sm:px-6 lg:px-8 py-3 max-w-6xl">
            {navigationItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="hover:bg-navbar-bg px-3 py-2 rounded-md transition"
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                onFocus={() => setFocusedIndex(index)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-row gap-3 mx-auto px-3">
            <button
              onClick={() => setTheme(THEMES.ARCADE)}
              ref={(el) => {
                itemRefs.current[navigationItems.length] = el;
              }}
              onFocus={() => setFocusedIndex(navigationItems.length)}
            >
              <Arcade className="mr-4 w-6 h-6" />
            </button>
            <button
            onClick={() => setTheme(THEMES.LIGHT)}
            ref={(el) => {
              itemRefs.current[navigationItems.length + 1] = el;
            }}
            onFocus={() => setFocusedIndex(navigationItems.length + 1)}
            >
              <SunLight className="mr-4 w-6 h-6" />
            </button>
            <button
            onClick={() => setTheme(THEMES.DARK)}
            ref={(el) => {
              itemRefs.current[navigationItems.length + 2] = el;
            }}
            onFocus={() => setFocusedIndex(navigationItems.length + 2)}
            >
              <HalfMoon className="w-6 h-6" />
            </button>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}