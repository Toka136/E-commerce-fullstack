import { LucideIcon } from "lucide-react";

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  /** "danger" renders the item in the destructive (logout) color. */
  variant?: "default" | "danger";
}
export interface SidebarUser {
  name: string;
  role: string;
  image?: string;
}

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
  activeId?: string;
  onNavigate?: (id: string) => void;
  navItems?: SidebarNavItem[];
  accountItems?: SidebarNavItem[];
  user?: SidebarUser;
}
export interface userNavbarProps {
  cartCount?: number;
  onMenuClick?: () => void;
  onCartClick?: () => void;
  guest: boolean;
}
export interface adminNavbarProps {
  notificationsCount?: number;
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  onSearch?: (query: string) => void;
}
export interface userNavbarProps {

  onMenuClick?: () => void;
  onCartClick?: () => void;
  onSearch?: (query: string) => void;
}