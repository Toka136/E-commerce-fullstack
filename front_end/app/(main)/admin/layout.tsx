"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/Auth/store/auth-store";
import { useAuthAdmin } from "@/features/BooksManagment/hooks/useAuthAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const {data:user,isLoading}=useAuthAdmin()

  return <>
  {user?.data.role!=="admin" && !isLoading && router.push("/")}
  {isLoading && <h1>Loading...</h1>}
  {children}
  </>;
}