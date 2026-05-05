import React from "react";
import Link from "next/link";

//TODO - Footer definieren
export default function Footer() {
  return (
    <footer className="flex justify-around p-4 text-lg text-dark font-medium text-center bg-[#101028]">
      <div className="flex justify-around max-w-screen-sm w-full">
        <Link href="/impressum" className="text-white hover:text-[#f06bc2]">
          Impressum
        </Link>
        <Link href="/datenschutz" className="text-white hover:text-[#f06bc2]">
          Datenschutz
        </Link>
      </div>
    </footer>
  );
}
