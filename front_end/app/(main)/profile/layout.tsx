import { getProfileApi } from "@/features/profile/api/getProfile";
import { NavCard } from "@/features/profile/components/navCard";
import { ProfileCard } from "@/features/profile/components/Profile card";
import { isAxiosError } from "axios";
import { redirect } from "next/navigation";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {


let user;

try {
  const response = await getProfileApi();
  user = response?.data;
} catch (error) {
  if (
   isAxiosError(error) &&
    [401, 403].includes(error.response?.status ?? 0)
  ) {
    redirect("/");
  }

  throw error;
}

if (!user) {
  redirect("/");
}
   
  return (
 
     <div className="min-h-screen bg-background px-4 py-10 sm:px-8">
     <div className="mx-auto grid w-full md:w-[80%] grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
             {/* ------------------------------------------------------------- */}
             {/* Left column                                                   */}
             {/* ------------------------------------------------------------- */}
             <div className="flex flex-col gap-6">
               {/* Profile card */}
               <ProfileCard user={user} />
     
               {/* Nav card */}
               <NavCard/>
             </div>
             {children}
     </div>
      {/* <Footer /> */}
    </div>
  );
}