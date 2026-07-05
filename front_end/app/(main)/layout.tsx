'use client'
import { useAuthStore } from "@/features/Auth/store/auth-store";
import Header from "@/UI/userHeader/Header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const router = useRouter();
  const role = useAuthStore((state) => state.userData?.userRole);

  useEffect(() => {
    if (role === "admin") {
      router.replace("/admin");
    }
  }, [role]);
  return (
 
    <>
      <Header />
      {children}
      {/* <Footer /> */}
    </>
  );
}