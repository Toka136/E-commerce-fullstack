"use client";

import { useEffect } from "react";
import { User, X } from "lucide-react";
import { SidebarProps } from "@/Types/HeaderTypes";
import { renderItem } from "../userHeader/sidebarItem";
import Image from "next/image";

export default function AdminSidebar({
  open,
  onClose,
  activeId = "explore",
  onNavigate,
  navItems,
  user,
}: SidebarProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    const isMobile = window.innerWidth < 1024;
    const previousOverflow = document.body.style.overflow;
    if (isMobile) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <>
      {/* Overlay - Mobile only */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/50
          transition-opacity duration-300
          lg:hidden
          ${open ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      {/* Sidebar */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Admin menu"
        className={`
          bg-[#f8f9ff] border-r border-slate-200

          /* Mobile */
          fixed left-0 top-0 z-50
          flex h-full w-72 flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}

          /* Desktop: ثابت 30% تحت ה-Navbar */
          lg:sticky lg:top-[65px]
          lg:z-auto
          lg:flex
          lg:h-[calc(100vh-65px)]
          lg:w-[30%]
          lg:min-w-[260px]
          lg:max-w-[360px]
          lg:translate-x-0
          lg:shadow-none
        `}
      >
        {/* Header - Mobile only */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 lg:hidden">
          <span className="flex flex-col">
            <span className="font-headline text-base font-bold text-primary">
              Admin Panel
            </span>
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-2 hover:bg-surface-container lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems?.map((item) =>
              renderItem(item, false, activeId, () => onNavigate?.(item.id))
            )}
          </ul>
        </nav>

        {/* Footer / Profile */}
        <div className="border-t border-slate-200 bg-[#eff4ff] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#b6c4ff]/30">
              {user?.image ? (
                <Image
                  width={40}
                  height={40}
                  sizes="40px"
                  priority
                  unoptimized
                  src={`http://localhost:4000/api/Uploads/${user.image}`}
                  alt="avatar"
                />
              ) : (
                <User size={26} />
              )}
            </div>

            <div className="flex-1 overflow-hidden">
              <p className="truncate font-body text-sm font-bold text-[#0b1c30]">
                {user?.name}
              </p>
              <p className="truncate font-headline text-xs text-[#444652]">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}