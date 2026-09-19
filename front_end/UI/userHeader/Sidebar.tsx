"use client";

import { useEffect } from "react";
import { User, X } from "lucide-react";
import { SidebarProps } from "@/Types/HeaderTypes";
import { renderItem } from "./sidebarItem";

export default function Sidebar({
  open,
  onClose,
  activeId = "explore",
  onNavigate,
  navItems,
  accountItems,
  user,
}: SidebarProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    
    // قفل الـ Scroll في الموبايل فقط
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
      {/* Overlay - الشاشات الصغيرة فقط */}
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
          bg-[#f8f9ff] border-r border-slate-200

          /* Mobile: Drawer فوق الشاشة */
          fixed left-0 top-0 z-70 flex h-full w-72 flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}

          /* Desktop: 30% ثابت تحت الـ Navbar */
          lg:sticky lg:top-[65px] lg:z-auto lg:flex lg:h-[calc(100vh-65px)] lg:w-[30%] lg:min-w-[260px] lg:max-w-[360px] lg:translate-x-0 lg:shadow-none
        `}
      >
        {/* Header (للشاشات الصغيرة فقط لإغلاق الـ Sidebar) */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 lg:hidden">
          <span className="select-none font-headline text-lg font-bold text-[#3455b9]">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-2 text-[#444652] hover:bg-[#e5eeff]"
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
            {accountItems?.map((item, idx) =>
              renderItem(item, idx === 0, activeId, () => onNavigate?.(item.id))
            )}
          </ul>
        </nav>

        {/* Footer / Profile */}
        <div className="border-t border-slate-200 bg-surface-container-low p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#b6c4ff]/30">
              {user?.image ? (
                <img
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
              <p className="truncate font-headline text-xs text-on-surface-variant">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}