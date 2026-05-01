import React from "react";
import Link from "next/link";

//TODO - Footer definieren
export default function Footer() {
  return (
    <footer className="flex justify-around p-4 text-lg text-dark font-medium text-center bg-slate-200">
      <div className="flex justify-around max-w-screen-sm w-full">
        <Link href="/impressum">Impressum</Link>
        <Link href="/datenschutz">Datenschutz</Link>
      </div>
    </footer>
  );
}
