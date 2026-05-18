import React from "react";
import Link from "next/link";

//TODO - Footer definieren
export default function Footer() {
    return (
        <footer className="shrink-0 flex justify-around bg-medio-dark p-4 short:py-2 font-medium text-lg short:text-base text-center">
            <div className="flex justify-around w-full max-w-screen-sm">
                <Link href="/impressum" className="text-white hover:text-medio-pink">
                    Impressum
                </Link>
                <Link href="/datenschutz" className="text-white hover:text-medio-pink">
                    Datenschutz
                </Link>
            </div>
        </footer>
    );
}
