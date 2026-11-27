import { useLogout } from "@/features/Auth/hooks/useLogout";
import { SidebarNavItem } from "@/Types/HeaderTypes";
import Link from "next/link";

export function renderItem(
  item: SidebarNavItem,
  isFirstAccountItem: boolean,
  activeId: string,
  onNavigate?: () => void,
  handleLogout?: () => void
) {
  console.log("item",item)
  console.log("active",activeId)
    const Icon = item.icon;
    const isActive = item.id.includes( activeId);
    const isDanger = item.variant === "danger";
    return (
        
      <li
        key={item.id}
        className={isFirstAccountItem ? "mt-4 border-t border-slate-200 pt-4" : undefined}
    
      >
        {item.id === "logout" || item.id === "adminLogout" ?
          <a
        onClick={ () => {handleLogout!();onNavigate?.()} }
        
          aria-current={isActive ? "page" : undefined}
          className={`flex cursor-pointer items-center gap-4 rounded-xl p-4 font-body text-sm transition-colors ${
            isDanger
              ? "text-error hover:bg-error-container"
              : isActive
                ? "bg-[#b6c4ff]/20 font-bold text-primary"
                : "text-on-surface-variant hover:bg-surface-container"
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
              ? "text-error hover:bg-error-container"
              : isActive
                ? "bg-primary text-white"
                : "text-on-surface hover:bg-surface"
          }`}
        >
          <Icon size={20} strokeWidth={2} />
          <span>{item.label}</span>
        </Link>}
      </li>
    );
  }