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
  /** Whether the drawer is visible. */
  open: boolean;
  /** Called when the overlay, close button, or Escape key is used. */
  onClose: () => void;
  /** id of the currently active nav item. */
  activeId?: string;
  /** Called with the item's id when a nav link is clicked. */
  onNavigate?: (id: string) => void;
  /** Primary nav items, shown above the divider. */
  navItems?: SidebarNavItem[];
  /** Secondary nav items (settings, logout, ...), shown below the divider. */
  accountItems?: SidebarNavItem[];
  /** Profile shown in the drawer footer. */
  user?: SidebarUser;
}
export interface userNavbarProps {
  /** Number shown on the cart badge. Pass 0 to hide the badge. */
  cartCount?: number;
  /** Called when the hamburger menu button is clicked. */
  onMenuClick?: () => void;
  /** Called when the cart button is clicked. */
  onCartClick?: () => void;
  /** Called when the search form is submitted, with the current query. */
  onSearch?: (query: string) => void;
}
export interface adminNavbarProps {
  /** Number shown on the cart badge. Pass 0 to hide the badge. */
  notificationsCount?: number;
  /** Called when the hamburger menu button is clicked. */
  onMenuClick?: () => void;
  /** Called when the cart button is clicked. */
  onNotificationClick?: () => void;
  /** Called when the search form is submitted, with the current query. */
  onSearch?: (query: string) => void;
}