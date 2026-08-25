"use client";

import { useEffect } from "react";
import {
  User,
  X,
} from "lucide-react";
import { SidebarNavItem, SidebarProps } from "@/Types/HeaderTypes";
import { renderItem } from "./sidebarItem";
import Image from "next/image";



export default function Sidebar({
  open,
  onClose,
  activeId = "explore",
  onNavigate,
  navItems ,
  accountItems,
  user ,
}: SidebarProps) {
  // Close on Escape, lock body scroll while open.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-60 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        aria-hidden={!open}
        className={`fixed left-0 top-0 z-70 flex h-full w-72 flex-col bg-[#f8f9ff] shadow-lg transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <span className="select-none font-headline text-xl font-bold text-[#3455b9]">
            LibroDiscovery
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-2 text-[#444652] transition-colors hover:bg-[#e5eeff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3455b9]/30"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1 px-3">
            {navItems!.map((item) => renderItem(item, false,activeId,()=> onNavigate?.(item.id)))}
            {accountItems!.map((item, idx) => renderItem(item, idx === 0,activeId, ()=> onNavigate?.(item.id)))}
          </ul>
        </nav>

        {/* Footer / profile */}
        <div className="border-t border-slate-200 bg-surface-container-low  p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#b6c4ff]/30">
              {user!.image ? <img 
              src={`http://localhost:4000/api/Uploads/${user!.image}`} 
              alt="avatar"
             /> : <User size={32} />}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-body text-sm font-bold text-[#0b1c30]">
                {user!.name}
              </p>
              <p className="truncate font-headline text-xs text-on-surface-variant">
                {user!.role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}