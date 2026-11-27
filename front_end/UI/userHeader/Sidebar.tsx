"use client";

import { useEffect } from "react";
import { User, X } from "lucide-react";
import { SidebarProps } from "@/Types/HeaderTypes";
import { renderItem } from "./sidebarItem";
import { useLogout } from "@/features/Auth/hooks/useLogout";

export default function Sidebar({
  open,
  onClose,
  activeId = "explore",
  onNavigate,
  navItems,
  accountItems,
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
   const {handleLogout}=useLogout()
  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-60 bg-black/50 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar / Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className={`
          bg-surface-tint border-r border-slate-200

          fixed left-0 top-0 z-70 flex h-full w-72 flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}

          lg:sticky lg:top-16.25 lg:z-auto lg:flex lg:h-[calc(100vh-65px)] lg:w-[30%] lg:min-w-[260px] lg:max-w-[360px] lg:translate-x-0 lg:shadow-none
        `}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-4 lg:hidden">
          <span className="select-none font-headline text-lg font-bold text-primary">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems?.map((item) =>
              renderItem(
                item,
                false,
                activeId,
                () => onNavigate?.(item.id),
                handleLogout
              )
            )}

            {accountItems?.map((item, idx) =>
              renderItem(
                item,
                idx === 0,
                activeId,
                () => onNavigate?.(item.id),
                handleLogout
              )
            )}
          </ul>
        </nav>

      
      </aside>
    </>
  );
}