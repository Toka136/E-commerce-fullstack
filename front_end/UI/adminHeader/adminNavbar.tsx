"use client";

import Link from "next/link";
import { Bell, Menu, User } from "lucide-react";
import { adminNavbarProps } from "@/Types/HeaderTypes";

export default function AdminNavbar({
  notificationsCount = 2,
  onMenuClick,
  onNotificationClick,
  userData,
}: adminNavbarProps) {
  const name = userData?.userName ?? "";
  const image = userData?.image;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
      {/* Signature accent line */}
      <div className="h-0.75 w-full bg-linear-to-r from-primary-500 to-secondary-500" />

      <nav className="mx-auto flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: menu + logo */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="rounded-lg p-2 text-[#0B66D0] transition-colors hover:bg-[#EFF6FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B66D0] lg:hidden"
          >
            <Menu size={20} strokeWidth={2} />
          </button>

          <Link
            href="/"
            className="select-none whitespace-nowrap font-serif text-xl text-[#0B66D0]"
          >
            LibroDiscovery
          </Link>
        </div>

        {/* Right: notifications + profile */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onNotificationClick}
            aria-label={`Notifications, ${notificationsCount} unread`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#0B66D0] transition-colors hover:bg-[#EFF6FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B66D0]"
          >
            <Bell size={20} strokeWidth={2} />
            {notificationsCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#0B66D0] px-1 text-[10px] font-bold leading-none text-white">
                {notificationsCount > 9 ? "9+" : notificationsCount}
              </span>
            )}
          </button>

          {/* Divider */}
          <span className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

          {/* Profile */}
          <div className="flex items-center gap-3 pl-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#DBEAFE] text-[#0B66D0]">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={name ? `${name}'s avatar` : "Your avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={22} />
              )}
            </div>

            <div className="hidden min-w-0 max-w-40 sm:block">
              <p className="truncate text-sm font-bold leading-tight text-[#0F172A]">
                {name}
              </p>
              <p className="truncate text-xs text-[#64748B]">Admin</p>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}