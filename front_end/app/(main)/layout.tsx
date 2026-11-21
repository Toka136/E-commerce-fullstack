
import { cookies } from "next/headers";
import AdminNavbar from "@/UI/adminHeader/adminNavbar";
import Navbar from "@/UI/userHeader/Navbar";
import {  getProfileApi } from "@/features/profile/api/getProfile";
import MainLayoutClient from "@/UI/components/MainLayoutClient";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  let userData = null;

    try {
      userData = await getProfileApi();
    } catch {
      userData = null;
    }
  

 console.log("data",userData)
  return (
    
    <MainLayoutClient userData={userData?.data}>
      {children}
    </MainLayoutClient>
  );
}