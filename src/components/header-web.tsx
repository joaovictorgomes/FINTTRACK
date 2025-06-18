"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Command } from "lucide-react";
import { UserDropdown } from "./user-dropdown";
import Image from "next/image";

const MenuItems = [
  {
    id: "1",
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    id: "2",
    name: "Registros",
    href: "/dashboard/registration",
  },
  {
    id: "3",
    name: "Historicos",
    href: "/dashboard/history",
  },
  {
    id: "4",
    name: "Galeria",
    href: "/dashboard/gallery",
  },
];

export default function HeaderWeb() {
  return (
    <header>
      <nav className="bg-zinc-950 py-2">
        <div className="flex flex-row items-center justify-between max-w-7xl mx-auto px-4 md:px-7 xl:px-4">
          <div className="flex flex-row items-center">
            {/* Logo and title */}
            <Link
              className="flex flex-row gap-2 items-center text-white"
              href="/dashboard"
            >
              <Image
                src="/favicon.svg"
                alt="Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
            </Link>

            {/* Desktop Navigation menu */}
            <NavigationMenu className="hidden md:flex max-w-none ml-20">
              <NavigationMenuList className="flex gap-1">
                {MenuItems.map((item) => (
                  <NavigationMenuItem key={item.id}>
                    <Link href={item.href}>
                      <button className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-800 hover:text-zinc-50 focus:bg-zinc-800 focus:text-zinc-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-zinc-800/50 data-[state=open]:bg-zinc-800/50 text-zinc-100">
                        {item.name}
                      </button>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* User dropdown - hidden on mobile */}
          <div className="hidden md:block text-white">
            <UserDropdown />
          </div>
        </div>
      </nav>
    </header>
  );
}
