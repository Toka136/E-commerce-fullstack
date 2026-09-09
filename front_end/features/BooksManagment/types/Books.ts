import { Category } from "@/features/categories/types/categories";
import { Book, getBooksResponse } from "@/features/userDashboard/types/books";

export type addBookModalT={
  open: boolean;
  onClose: () => void;
  categories:Category[]
}
export type editBookModalT= addBookModalT & {
 book:editBookT
}
export type bookT={
    _id:string,
    title:string,
    author:string,
    genre:string,
    price:number,
    description:string,
    coverImage:string,
    stock:number
}
export type addBookT={
    title:string,
    author:string,
    slug:string,
    price:number,
    description:string,
    coverImage?:File|null,
    stock:number,
    pages:number
}

   export interface editBookT {
  title?: string;
  author?: string;
  slug?: string;
  price?: number;
  description?: string;
  coverImage?: string;
  stock?: number;
  _id: string;
  pages?: number;

  category?: {
    _id: string;
    name: string;
    slug: string;
  };

}
export type bookResponseT={
    message:string,
    statusCode:number
   data:{
    data:bookT[],
    totalCount:number,
    pageSize:number,
    currentPage:number,
    totalPage:number
   }
}
export type paginationT={
    count:number,
    page:number,
    onchange:( event: React.ChangeEvent<unknown>,
    value: number,)=>void
}
export type booksTableT={
    books:bookT[],
    count:number,
    page:number,
    setPage:(page:number)=>void
}
export type bookParams={
    pageSize:number,
    currentPage:number,
    searchText:string
}
export type booksTableParamsT=
    {
        result:{
        books:Book[],
        totalCount:number,
        pageSize:number,
        currentPage:number,
        totalPage:number},
        categories:Category[],
    }
export type  DeleteModalPropsT= {
  open: boolean;
  onClose: () => void;
  title?: string;
  itemName?: string;
  loading?: boolean;
  id:string
}