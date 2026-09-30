"use client";

import { useState } from "react";
import { Bell, Menu, Search, ShoppingBag } from "lucide-react";
import { adminNavbarProps } from "@/Types/HeaderTypes";



export default function AdminNavbar({
  notificationsCount = 2,
  onMenuClick,
  onNotificationClick,
  onSearch,
}: adminNavbarProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    onSearch?.(query);
  }

  return (
    <header className="relative w-full border-b border-tertiary-300 bg-white px-8">
      {/* Signature accent line */}
      <div className="h-0.75 w-full bg-linear-to-r from-primary-500 to-secondary-500" />

      <nav className="flex items-center gap-3 px-8 py-3 sm:gap-4 sm:px-6 flex-wrap">
        {/* Left: menu + logo */}
        <div className="flex items-center gap-3">
         <button
  type="button"
  onClick={onMenuClick}
  aria-label="Open menu"
  className="rounded-lg p-2 text-[#3F5FBD] transition-colors hover:bg-tertiary-200 hover:text-primary-600 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 lg:hidden"
>
  <Menu size={20} strokeWidth={2} />
</button>

          <span className="select-none whitespace-nowrap font-headline text-lg font-bold text-[#3F5FBD]">
            LibroDiscovery
          </span>
        </div>

      

        {/* Right: cart */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={onNotificationClick}
            aria-label={`Cart, ${notificationsCount} item${notificationsCount === 1 ? "" : "s"}`}
            className="relative rounded-full bg-transparent p-2.5 text-[#3F5FBD] transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
          >
            <Bell size={18} strokeWidth={2} />
            {notificationsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#9550FF] font-label text-[10px] font-bold leading-none text-white">
                {notificationsCount > 9 ? "9+" : notificationsCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
