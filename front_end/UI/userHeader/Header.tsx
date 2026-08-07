'use client'
import  { useState } from 'react'
import Navbar from './Navbar';
import {
  Compass,
  Receipt,
  Heart,
  MessageSquareText,
  Settings,
  LogOut,
  User,
  
  X,
  type LucideIcon,
  LayoutDashboard,
  BookOpen,
  Users,
  LucideSettings,
} from "lucide-react";
import { SidebarNavItem, SidebarUser } from '@/Types/HeaderTypes';
import Sidebar from './Sidebar';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/Auth/store/auth-store';
import AdminNavbar from '../adminHeader/adminNavbar';
import AdminSidebar from '../adminHeader/adminSidebar';
import SideCart from '@/features/cart/components/cartDrawer';
import { CartItem } from '@/features/cart/types/cart';
import { useCartStore } from '@/features/cart/store/cart-store';
const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
   const {onOpen}=useCartStore()
    const [notificationOpen, setNotificationOpen] = useState(false);
    const[activeId,setActiveId]=useState("explore")
    const useData=useAuthStore((state)=>state.userData)
    const onNavigate = (id: string) => {
      setMenuOpen(false);
      setActiveId(id);
    }
    const defaultNavItems: SidebarNavItem[] = [
      { id: "/", label: "Explore", icon: Compass },
      { id: "orders", label: "My Orders", icon: Receipt },
      { id: "wishlist", label: "Wishlist", icon: Heart },
      { id: "reviews", label: "My Reviews", icon: MessageSquareText },
    ];
    
    const defaultAccountItems: SidebarNavItem[] = [
      { id: "settings", label: "Account Settings", icon: Settings },
      { id: "logout", label: "Logout", icon: LogOut, variant: "danger" },
    ];
 
    const defaultUser: SidebarUser = {
      name: useData.userName,
      role: "Reader",
      image: useData.userAvatar
    };
      const adminDefaultNavItems: SidebarNavItem[] = [
      { id: "/", label: "Dashboard", icon: LayoutDashboard },
      { id: "/inventory", label: "Inventory", icon: BookOpen },
      { id: "orders", label: "My Orders", icon: Receipt },
      { id: "customers", label: "Customers", icon: Users },
      { id: "seetings", label: "Settings", icon: LucideSettings },
      { id: "adminLogout", label: "Logout", icon: LogOut, variant: "danger" }
    ];
   const onSearch=(query:string)=>{
       console.log("query",query)
   }
  return (
    <>
    {useData.userRole==="admin"?(
      <div>
    <AdminNavbar onNotificationClick={()=>setNotificationOpen(true)} onMenuClick={()=>setMenuOpen(true)} onSearch={onSearch}/>
    <AdminSidebar activeId={activeId} onNavigate={onNavigate} open={menuOpen} onClose={() => setMenuOpen(false)} navItems={adminDefaultNavItems} user={defaultUser} />
      </div>
      
    ):(
    <div>
    <Navbar onCartClick={()=>onOpen()} onMenuClick={()=>setMenuOpen(true)} onSearch={onSearch}/>
    <Sidebar activeId={activeId} onNavigate={onNavigate} open={menuOpen} onClose={() => setMenuOpen(false)} navItems={defaultNavItems} accountItems={defaultAccountItems} user={defaultUser} />
      <SideCart    /> 
       </div>)}
        </>
  )
}

export default Header