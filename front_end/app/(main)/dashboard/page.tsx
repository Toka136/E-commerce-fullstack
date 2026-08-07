import Dashboard from "@/features/userDashboard/components/Dashboard";
import SearchBar from "@/features/userDashboard/components/SearchBar";
import { useGetBooks } from "@/features/userDashboard/hooks/useGetBooks";
interface urlParams {
 searchParams:Promise<{pageSize?:number,currentPage?:number,searchText?:string}>
}
export default async function Home(urlParams:urlParams) {
  const params=await urlParams.searchParams
  
  return (
    <>
    <div className="flex justify-center items-center pt-8 bg-[#F8F9FF] ">
         <SearchBar />
         </div>
   
    <Dashboard
      pageSize={4}
      currentPage={params.currentPage}
      searchText={params.searchText}
    />
    </>
  );
}
