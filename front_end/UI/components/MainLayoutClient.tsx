
"use client";

import { useState } from "react";
import { useCartStore } from "@/features/cart/store/cart-store";
import AdminNavbar from "@/UI/adminHeader/adminNavbar";
import Navbar from "@/UI/userHeader/Navbar";
import Header from "@/UI/userHeader/Header";
import { userProfile } from "@/features/profile/types/profile";

export default function MainLayoutClient({
  children,
  userData,
}: {
  children: React.ReactNode;
  userData?: userProfile;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const onOpen = useCartStore((state) => state.onOpen);

  return (
    <>
      {userData?.role==="ADMIN" ? (
        <AdminNavbar onMenuClick={() => setMenuOpen(true)} userData={userData}  />
      ) : (
        <Navbar
          onCartClick={onOpen}
          onMenuClick={() => setMenuOpen(true)}
          guest={!userData}
          userData={userData}
        />
      )}

      <div className="min-h-screen flex">
        <Header
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          userData={userData}
        />

        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </>
  );
}