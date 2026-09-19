'use client'
import { useAuthStore } from "@/features/Auth/store/auth-store";
import { useCartStore } from "@/features/cart/store/cart-store";
import AdminNavbar from "@/UI/adminHeader/adminNavbar";
import Header from "@/UI/userHeader/Header";
import Navbar from "@/UI/userHeader/Navbar";
import { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [activeId, setActiveId] = useState("explore");
  
    const { onOpen } = useCartStore();
    const useData = useAuthStore((state) => state.userData);
    const isAdmin = useData.userRole === "admin";
  
  return (
    <div>
        {isAdmin ? (
              <AdminNavbar
                onMenuClick={() => setMenuOpen(true)}
              />
            ) : (
              <Navbar
                onCartClick={() => onOpen()}
                onMenuClick={() => setMenuOpen(true)}
              />
            )}
    <div className="min-h-screen flex ">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="flex flex-1">
        <main className="flex-1 min-w-0 ">
          {children}
        </main>
      </div>
    </div>
    </div>
  );
}