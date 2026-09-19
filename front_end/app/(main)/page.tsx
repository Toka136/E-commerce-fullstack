import Dashboard from "@/features/userDashboard/components/Dashboard";
interface urlParams {
 searchParams:Promise<{pageSize?:number,currentPage?:number,searchText?:string}>
}
export default async function Home(urlParams:urlParams) {
  const params=await urlParams.searchParams
  
  return (
    <>
 
   
    <Dashboard
      pageSize={4}
      currentPage={params.currentPage}
      searchText={params.searchText}
    />
    </>
  );
}
