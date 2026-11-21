"use client";

import { useRouter } from "next/navigation";
import { useAuthAdmin } from "@/features/BooksManagment/hooks/useAuthAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const {data:user,isLoading}=useAuthAdmin()
  console.log("user",user)
  if( user?.data.role!=="ADMIN" && !isLoading )
     router.push("/")
  return <>
    {isLoading ? <h1>Loading...</h1>:

     user?.data.role==="ADMIN" && children}
  </>;
}