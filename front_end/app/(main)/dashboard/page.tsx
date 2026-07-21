"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  PlusCircle,
  ArrowRight,
  Compass,
  LayoutGrid,
  ShoppingCart,
  User,
  ScanLine,
} from "lucide-react";
import  BookCard  from "@/features/userDashboard/components/BookCard";
import { bookResponseT, bookT } from "@/features/BooksManagment/types/Books";
import { GetBooks } from "@/features/BooksManagment/api/booksApi";
import { CircularProgress } from "@mui/material";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FeaturedBook {
  _id: string;
  title: string;
  author: string;
  price: string;
  tag: string;
  image: string;
}

interface Category {
  id: string;
  name: string;
  subtitle?: string;
  image: string;
  gradientFrom: string;
  span: string; // tailwind col-span classes
}

interface RecentBook {
  _id: string;
  title: string;
  author: string;
  genre: string;
  price: string;
  badge?: string;
  badgeStyle?: string;
  image: string;
}


const CATEGORIES: Category[] = [
  {
    id: "fiction",
    name: "Fiction",
    subtitle: "Explore thousands of worlds",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFoEdyfBfjafo5h7rOXitaMvE4fGDZycG0e6lf1IvEUxriH_4XbEGJZnu3YSMHoIupQcGmdJIZSyfPtZrc1FduAGWShJr8YJ14pn-OSsF7uMOPFta10UGvkGDSIOtTMbCdQKuVCFnrGQbiHo2WTDe2fTb90A9Q3nBMZc7TMSIroUGFxQFht1Z6S2tsQnAw0Dqk9dc3KXvgSa8gHiRB1nFF7unC_AWqXmKqIQueWx0XsOv53DRl-WRMU5xn9jgz0UbKfamhwyE2aTg",
    gradientFrom: "from-[#3455b9]/80",
    span: "col-span-2",
  },
  {
    id: "science",
    name: "Science",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDSmDSgHNtDCGCTaU-1xsUuUtYnf1_35tq30OqtAIqKErrqrnAATDRXJvgUo79J0I1GRgkkxaScm4XnsBQsPHF8kwnjjHEt3pGuXnHzCpG6Ul0wG1f14aJd7Qzd3kbHHK3rlPrZ3DLgNH2tfFAshwgyJLwBSRv981MNkQd3S-WmwWWDJURDsZqkf3FXhT861XuFz4wXYuCa4UZVDB3AAS_lJsqJMB47GuqXG1y1SrVt9ikpPstsvfr8PWuAgQ0v-khyauwTdAppa2A",
    gradientFrom: "from-[#6049c6]/80",
    span: "",
  },
  {
    id: "arts",
    name: "Arts",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD3nV6f9Eag1vq7vfJz096Kyu_7iWiNjyBi_jRKZpjHaqZsTKUiYKUR8SsVDqOD9hp3LZcxO4o2VmQNQf6YmwuwZlzKH5QY7L-mO9lFHL5iq-3tj4givwjLlk63H9670gZ89bvu9WkJ3kFgv69-TlaHRJEqX431zq89DRg_-2Dt0o560QYvAR2APo_Ju2fAmNK2WwwVry5rsSpgupaUh4Eno8lNRPAKPpQx6RX836a6AxBPZdpmPf1YqytK8SC3SVjMB93fSLihySI",
    gradientFrom: "from-[#575c65]/80",
    span: "",
  },
  {
    id: "history",
    name: "History",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDDB8eF527YF1XSGmdY85IyRKF-O4P1c1j49777WepTX7EiYggaDbH4YuYrrC-bqbtiWuNFmdV-KoK2WVm-GNZL5Om6QoR1MNmOQnjGWan5E1CQiui61aILZnDT9XE4j5TunsHk0lqmBuiROgasqvH_1dl_538QfeEtvcYeNt-kVZ5TfvhHM0gt_8pl3_Qennq-iSZDMK-T7lDTI33kl6zl6AeClTWMduOLBM-dCF4yw8XEJ5hTV-FyzI2CjsVlAa6XX3-Es9nJOTY",
    gradientFrom: "from-[#747684]/80",
    span: "md:col-span-1",
  },
  {
    id: "lifestyle",
    name: "Lifestyle & Wellness",
    subtitle: "Nurture your body and mind",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTqBOOLzIO8ziJyVWNe1S1JnlTQjAIxKnuf2FSnm754NmZ2Tt445A9luFukkYQRoActkMgcSDQD8HX8hDKbzZ-1qrTrNScn0_3487ns-OswzkiFoF9KOaangv_HtPAuHirYKuRwIMrQqfLjnU_cR6K9q_l8ExPsQMhN1h3tlDVXMo5gitv30GFGe15UfiSwUtkKjce7NKGJfcymCVr108d2Kvd_M5AJ5q7cXehwLKCOiUAxp4FoTO28cKl8mTzHhANuCyHzR6XU7o",
    gradientFrom: "from-[#506ed3]/80",
    span: "md:col-span-3",
  },
];

const RECENT_BOOKS: bookT[] = 
[
  {
    _id: "echoes-of-silence",
    title: "Echoes of Silence",
    author: "Elena Valance",
    price: 24.99,
    genre: "BESTSELLER",
    description:"",
    stock: 12,
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-NYrJqz2uK2S-y-Zm2D6ieMYy5j2rdiZOjiR0m_zq0sstPcE6gDtbpIo-BjS6N7sFyvI2sgAItztfVl6fzo7uCbAVNtxRDgQwN7iwTPgkSo7wJ4imCZ9HSHayp38LcEhuhSe-AtWHOrlzD1eyDh_68oZFPfeVhvQNtjlIqCM9RAkqbQtU_vo2cZZ5crwgS4Xf1c_5RsHxvubraDnKqXyzX6gU-EcLhDD3Qnq9WRUwwwqcogrbbV3Ab1VXyQo7rY_cA4J4oHAXBw4",
  },
  {
    _id: "urban-oasis",
    title: "The Urban Oasis",
    author: "Marcus Thorne",
    price: 18.50,
    genre: "EDITOR'S CHOICE",
     description:"",
    stock: 12,
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgl79BmmGKiJx8qfkd13tDP3UqEGwHFOmqkkiYHVIMSToeECcIrkW9B1V1ZQs5ST0j4gUA2iT9LyruvwJOJRsjkoF33r0HVBeWdlFlXp4NNvcUa29ba-YYBoHvtl6OYXbR1bdDl7Xtz6BdCna7mSMZo4NweQP5Yj5bW7WgFc_tbkDikk4i2nfmLWOmHSxzOU6rXUjb9Nt2dWrhSKmh4vOlGPEdgyTtLP7bsRKT6MJTpvSV8ZwRaUhvT6oKtmgKX-qkS1iU3j5E0c0",
  },
  {
    _id: "quantum-logic",
    title: "Quantum Logic",
    author: "Dr. Sarah Jenks",
    price: 32.00,
    genre: "NEW RELEASE",
     description:"",
    stock: 12,
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwzYIKa1lSwNrHUWSAAtbldln2b_U84BZH9VWq5NUtduF43ZVzEP_6rIBvR9fsVixm2U3tMGmeKXdni4JLe19lS8el8YwlKZ5CN1sRbOx9iOaI4nod8YCciRCpmQlZ5sLjpTX6sXujKMMgwPfQN2Aq4AAeVBdGIjWNVqXqCeo2QeVzFNzkS6qd-ulK9IzsL3JlFnP1NZcgR4NTYb1ok5ODDsKGpMjI0ZAS81MX0IkgEPZK8v-w-suk6vGi48ZCCDapsSyhE-W3B28",
  },
  {
    _id: "whispers-of-oak",
    title: "Whispers of Oak",
    author: "Julian Rivers",
    price: 21.99,
    genre: "FEATURED",
     description:"",
    stock: 12,
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCmhddWGJedkb9igKdYG6Mm8xq7xzY8P0ecyo9rIoaB5oLSOjyp16lGV1TXkmaD7-zH19ngvmAE1PM9xfAQE39OFCxbVsUv2WfK5xLHw33FvY_NXkWuMLVpJxsgLChZB06VM1l_0v4nQ6uJ8ilOVwKUb9b_dS3HG10m5VYjGrzW05w7jKrrD_BmBic72Gka1K58Nyxlms6r0K3eeYrXUnHil7dodbJQO8vEXzwYuZfB3rnwwEdd-K4VzweHirhsJ9JNy9Wd8Waj8iE",
  },
];
// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LibroDiscovery() {
  const [activeNav, setActiveNav] = useState<string>("explore");
  const [searchText, setSearchText] = useState<string>("");
    const [loading, setLoading] = useState(true);
  const [result,setResult]=useState<bookResponseT>({
       message: "",
       statusCode: 0,
       data: {
         data: [],
         totalCount: 0,
         pageSize: 0,
         currentPage: 0,
         totalPage: 0
       }
       
     })
  const fetchBook=async ()=>{
    const res=await GetBooks({pageSize:5,currentPage:1,searchText})
    setResult(res)
    setLoading(false)
  }
  useEffect(()=>{
    fetchBook()
  },[searchText])
  return (
   <>
   {loading?<CircularProgress/>:
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans pb-28">
      <main className="pt-6 max-w-7xl mx-auto px-4 md:px-10">
        {/* Search bar */}
        <section className="mb-10">
          <div className="relative w-full">
            <input onChange={(e)=>setSearchText(e.target.value)}
              type="text"
              placeholder="Search for books..."
              className="w-full bg-[#eff4ff] border-none rounded-xl py-4 pl-12 pr-4 text-base shadow-sm placeholder:text-[#747684] focus:outline-none focus:ring-2 focus:ring-[#3455b9]/20"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#747684]"
              size={20}
            />
          </div>
        </section>

        {/* Weekly Features */}
        <section className="mb-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Weekly Features</h2>
              <p className="text-sm text-[#444652]">
                Handpicked stories for your collection.
              </p>
            </div>
            <button className="text-[#3455b9] text-sm font-semibold hover:underline flex items-center gap-1">
              See all <ArrowRight size={16} />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-2 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {result.data.data.map((book) => (
             <BookCard book={book} />
            ))}
          </div>
        </section>

        {/* Shop by Category */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className={`relative h-40 rounded-xl overflow-hidden group cursor-pointer ${cat.span}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${cat.image}')` }}
                />
                <div className={`absolute inset-0 bg-linear-to-t ${cat.gradientFrom} to-transparent`} />
                <div className="absolute bottom-3 left-3">
                  <h4 className="text-lg text-white font-bold">{cat.name}</h4>
                  {cat.subtitle && (
                    <p className="text-xs text-white/80">{cat.subtitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recently Added */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Recently Added</h2>
            <span className="text-xs text-[#747684]">12 New Books Today</span>
          </div>
          <div className="space-y-4 flex flex-wrap gap-4">
            {RECENT_BOOKS.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </section>
      </main>

      {/* Bottom nav bar (mobile) */}
      {/* <nav className="fixed bottom-0 w-full z-50 rounded-t-xl bg-[#f8f9ff] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] border-t border-[#c4c5d5]/30 md:hidden">
        <div className="flex justify-around items-center h-16 px-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`relative flex flex-col items-center justify-center gap-0.5 px-4 py-1 rounded-xl transition-all active:scale-90 ${
                  isActive
                    ? "text-[#3455b9] font-bold bg-[#b6c4ff]/20"
                    : "text-[#444652] hover:bg-[#e5eeff]"
                }`}
              >
                <Icon size={22} fill={isActive ? "currentColor" : "none"} />
                <span className="text-[11px]">{item.label}</span>
                
              </button>
            );
          })}
        </div>
      </nav> */}

      {/* Floating scan button */}
      <button
        aria-label="Scan barcode"
        className="fixed right-4 bottom-24 bg-[#3455b9] text-white w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 md:hidden z-40"
      >
        <ScanLine size={26} />
      </button>
    </div>}
   </>
  );
}