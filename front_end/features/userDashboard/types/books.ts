import { Category } from "@/features/categories/types/categories";

export interface Book {
  _id: string;
  title: string;
  author: string;
 category:Category
  price: number;
  description: string;
  coverImage: string;
  stock: number;
  rate: {
    average: number;
    count: number;
  };
  createdAt: string; 
}

export interface getBooksResponse{
    status: string;
    message: string,
    data:{
        books:Book[],
        totalCount:number,
        pageSize:number,
        currentPage:number,
        totalPage:number
    }

}
export type SortOption="price-asc"|"price-desc"|"newest"|"oldest"
export interface gteBooksParams{
    pageSize?:number,
    currentPage?:number,
    searchText?:string,
    category?:string,
    minPrice?:number,
    maxPrice?:number
   sort?:SortOption
}