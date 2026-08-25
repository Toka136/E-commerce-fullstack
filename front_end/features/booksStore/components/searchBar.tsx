"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

/** Standalone search input, styled to match the reference mobile search bar. */
export default function SearchBar() {
  const searchParams=useSearchParams();
    const router=useRouter()
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>,text:string)=>{
        const params=new URLSearchParams(searchParams);
        params.set("searchText",text);
        router.push(`?${params.toString()}`);
    }
  return (
    <section className="w-full md:w-[60%] mx-auto mt-8" >
      <div className="relative w-full">
        <input
        onChange={(e)=>handleChange(e,e.target.value)}
         
          type="text"
          placeholder="Search for books..."
          className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 text-body-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
      </div>
    </section>
  );
}