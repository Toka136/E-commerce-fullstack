import { useLogout } from "@/features/Auth/hooks/useLogout";
import { SidebarNavItem } from "@/Types/HeaderTypes";
import Link from "next/link";

export  function renderItem(item: SidebarNavItem, isFirstAccountItem: boolean, activeId: string, onNavigate?: () => void) {
    const Icon = item.icon;
    const isActive = item.id === activeId;
    const isDanger = item.variant === "danger";
    const {handleLogout}=useLogout()

    return (
    
      <li
        key={item.id}
        className={isFirstAccountItem ? "mt-4 border-t border-slate-200 pt-4" : undefined}
    
      >
        {item.id === "logout" || item.id === "adminLogout" ?
          <a
        onClick={ () => {handleLogout();onNavigate?.()} }
        
          aria-current={isActive ? "page" : undefined}
          className={`flex cursor-pointer items-center gap-4 rounded-xl p-4 font-body text-sm transition-colors ${
            isDanger
              ? "text-[#ba1a1a] hover:bg-[#ffdad6]"
              : isActive
                ? "bg-[#b6c4ff]/20 font-bold text-[#3455b9]"
                : "text-[#444652] hover:bg-[#e5eeff]"
          }`}
        >
          <Icon size={20} strokeWidth={2} />
          <span>{item.label}</span>
        </a>:
        <Link
        onClick={ () => onNavigate?.()}
          href={item.id}
          aria-current={isActive ? "page" : undefined}
          className={`flex items-center gap-4 rounded-xl p-4 font-body text-sm transition-colors ${
            isDanger
              ? "text-[#ba1a1a] hover:bg-[#ffdad6]"
              : isActive
                ? "bg-[#9581FF] "
                : "text-[#444652] hover:bg-[#e5eeff]"
          }`}
        >
          <Icon size={20} strokeWidth={2} />
          <span>{item.label}</span>
        </Link>}
      </li>
    );
  }