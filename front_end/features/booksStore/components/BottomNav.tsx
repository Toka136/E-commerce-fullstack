"use client";

import { Compass, LayoutGrid, ShoppingBag, CircleUserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Explore", href: "/store", icon: Compass },
  { label: "Categories", href: "/categories", icon: LayoutGrid },
  { label: "Cart", href: "/cart", icon: ShoppingBag },
  { label: "Account", href: "/account", icon: CircleUserRound },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-slate-200 bg-white/95 backdrop-blur-sm px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            className={`flex flex-col items-center gap-1 rounded-lg px-3 py-1 text-[11px] font-medium transition-colors ${
              isActive ? "text-[#4F46E5]" : "text-[#94A3B8]"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.25]" : "stroke-[1.75]"}`} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
