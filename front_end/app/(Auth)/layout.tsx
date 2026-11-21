import { getProfileApi } from "@/features/profile/api/getProfile";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function  AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
 try{
     await getProfileApi();
      redirect("/");
 } catch {
  
  
 }
  
  return <main>{children}</main>;
}