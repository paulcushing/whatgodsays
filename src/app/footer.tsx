"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  return (
    <footer className="py-10 bg-black z-10">
      <div className="px-10 mx-auto max-w-7xl">
        <div className="flex flex-col justify-between text-center md:flex-row">
          <p className="order-last text-sm leading-tight text-gray-400 md:order-first">
            Built for God&apos;s glory and your joy!
          </p>
          {usePathname() === "/" && (
            <ul className="flex flex-row justify-center pb-3 -ml-4 -mr-4 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 touch-pan-y px-4">
                  About
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
