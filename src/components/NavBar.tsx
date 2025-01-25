"use client";

import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="p-4 px-8 iphone:px-0 flex justify-between items-center border-b border-[#ff3366] ">
      <div className="flex items-center justify-between container gap-4">
        <div>
          <Link
            href="/"
            onClick={() => {
              redirect("/");
            }}
          >
            <Image
              src="/logo.svg"
              alt="Logo"
              width={200}
              height={200}
              priority
              style={{
                cursor: "pointer",
                userSelect: "none",
                objectFit: "contain",
              }}
            />
          </Link>
        </div>
        <nav className="flex items-center iphone:text-sm lg:text-base space-x-6 px-4 py-2 hover:border-[#ff3366] border border-transparent rounded-full bg-[rgba(255,255,255,0.1)]">
          <Link
            href={"/"}
            className={` ${
              pathname === "/" ? "text-[#ff3366]" : "text-muted-foreground"
            }`}
          >
            Pokedex
          </Link>
          <Link
            href={"/teambuilder"}
            className={`${
              pathname === "/teambuilder"
                ? "text-[#ff3366]"
                : "text-muted-foreground"
            }`}
          >
            Team Builder
          </Link>
        </nav>
      </div>
    </header>
  );
}
