import { useAuthStore } from "@/features/Auth/store/auth-store";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function  AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (token) {
    console.log("token",token)
    redirect("/");
  }
  return <main>{children}</main>;
}