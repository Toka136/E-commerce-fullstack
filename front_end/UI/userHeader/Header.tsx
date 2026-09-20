"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import {
  Compass,
  Receipt,
  Heart,
  MessageSquareText,
  Settings,
  LogOut,
  User,
  LayoutDashboard,
  BookOpen,
  Users,
  StoreIcon,
} from "lucide-react";

import { SidebarNavItem, SidebarUser } from "@/Types/HeaderTypes";
import Sidebar from "./Sidebar";
import { useAuthStore } from "@/features/Auth/store/auth-store";
import AdminNavbar from "../adminHeader/adminNavbar";
import AdminSidebar from "../adminHeader/adminSidebar";
import SideCart from "@/features/cart/components/cartDrawer";
import { useCartStore } from "@/features/cart/store/cart-store";
import { useGetProfile } from "@/features/profile/hooks/useGetProfile";

const Header = ({menuOpen, setMenuOpen}:{menuOpen:boolean, setMenuOpen:(value:boolean)=>void}) => {
  
  const [activeId, setActiveId] = useState("explore");

  const { onOpen } = useCartStore();
  const { data: useData, isLoading } = useGetProfile();

  const onNavigate = (id: string) => {
    setMenuOpen(false);
    setActiveId(id);
  };

  const defaultNavItems: SidebarNavItem[] = [
    { id: "/dashboard", label: "Explore", icon: Compass },
    { id: "/books", label: "Store", icon: StoreIcon },
    { id: "/orders", label: "My Orders", icon: Receipt },
    { id: "/wishlist", label: "wishlist", icon: Heart },
  
  ];

  const defaultAccountItems: SidebarNavItem[] = [
    {
      id: "profile",
      label: "profile",
      icon: Settings,
    },
    {
      id: useData?.data._id ? "logout" : "/login",
      label: useData?.data._id ? "Logout" : "Login",
      icon: useData?.data._id ? LogOut : User,
      variant: useData?.data._id ? "danger" : "default",
    },
  ];

  const defaultUser: SidebarUser = {
    name: useData?.data.userName??"",
    role: "Reader",
    image: useData?.data.image,
  };

  const adminDefaultNavItems: SidebarNavItem[] = [
    {
      id: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "/admin/inventory",
      label: "Inventory",
      icon: BookOpen,
    },
    {
      id: "/admin/orders",
      label: "Orders",
      icon: Receipt,
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
    },
    {
      id: "/admin/categories",
      label: "Categories",
      icon: Compass,
    },
    {
      id: "adminLogout",
      label: "Logout",
      icon: LogOut,
      variant: "danger",
    },
  ];



  const isAdmin = useData?.data.role === "admin";

  return (
    <div className="flex flex-col min-h-screen">
    

      {/* 2. الـ Sidebar والـ Cart تحت الـ Navbar */}
      {isAdmin ? (
        <AdminSidebar
          activeId={activeId}
          onNavigate={onNavigate}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          navItems={adminDefaultNavItems}
          user={defaultUser}
        />
      ) : (
        <Sidebar
          activeId={activeId}
          onNavigate={onNavigate}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          navItems={defaultNavItems}
          accountItems={defaultAccountItems}
          user={defaultUser}
        />
      )}

      {!isAdmin && <SideCart />}
    </div>
  );
};

export default Header;