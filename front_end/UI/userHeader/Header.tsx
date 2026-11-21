"use client";

import { useEffect, useState } from "react";
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
  Tag,
} from "lucide-react";

import { SidebarNavItem, SidebarUser } from "@/Types/HeaderTypes";
import Sidebar from "./Sidebar";
import AdminSidebar from "../adminHeader/adminSidebar";
import SideCart from "@/features/cart/components/cartDrawer";
import { useCartStore } from "@/features/cart/store/cart-store";
import { useGetProfile } from "@/features/profile/hooks/useGetProfile";
import { usePathname } from "next/navigation";
import { userProfile } from "@/features/profile/types/profile";

const Header = ({menuOpen, setMenuOpen,userData}:{menuOpen:boolean, setMenuOpen:(value:boolean)=>void,userData?:userProfile}) => {
  
  const [activeId, setActiveId] = useState<string | null>(null);

  const { onOpen } = useCartStore();

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

  const gestAccountItems: SidebarNavItem[] = [
    {
      id:  "/login",
      label:  "Login",
      icon:  User,
      variant:  "default",
    },
  ];
  const userAccountItems: SidebarNavItem[]= [
    {
      id: "/profile",
      label: "profile",
      icon: Settings,
    },
    {
      id:  "logout" ,
      label:  "Logout" ,
      icon:  LogOut ,
      variant:  "danger" ,
    },
  ];
    const defaultAccountItems=userData?.id?userAccountItems:gestAccountItems


  const defaultUser: SidebarUser = {
    name: userData?.userName??"",
    role: "Reader",
    image: userData?.image,
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
      id: "/admin/categories",
      label: "Categories",
      icon: Compass,
    },
    {
      id: "/admin/coupons",
      label: "Coupons",
      icon: Tag,
    },
    {
      id: "adminLogout",
      label: "Logout",
      icon: LogOut,
      variant: "danger",
    },
  ];

   console.log("userData",userData)

  const isAdmin = userData?.role === "ADMIN";
   const pathname = usePathname();
 useEffect(() => {
  console.log("isAdmin",isAdmin);
 const pathnameWithoutBase = isAdmin?pathname.split("/")[2]:pathname.split("/")[1];
 console.log(pathnameWithoutBase);
  const currentActiveId = pathnameWithoutBase||activeId;
  setActiveId(currentActiveId);
 }, [pathname,isAdmin]);
  return (
    <div className="flex flex-col min-h-screen">
    

      {isAdmin ? (
        <AdminSidebar
          activeId={activeId??""}
          onNavigate={onNavigate}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          navItems={adminDefaultNavItems}
          user={defaultUser}
        />
      ) : (
        <Sidebar
          activeId={activeId??""}
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
