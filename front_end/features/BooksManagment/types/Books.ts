
export type addBookModalT={
  open: boolean;
  onClose: () => void;
}
export type editBookModalT= addBookModalT & {
  id:string,
  fetchBooks:()=>void
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
    genre:string,
    price:number,
    description:string,
    coverImage?:File|null,
    stock:number
}
export type editBookT=addBookT&{
    _id:string
   
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
        setEditId:(id:string)=>void,
        setDeleteId:(id:string)=>void,
        setIsDelteModalOpen:(open:boolean)=>void,
        setIsEditModalOpen:(open:boolean)=>void,
        result:bookResponseT,loading:boolean,
        setPage:(page:number)=>void,
        page:number
    }
export type  DeleteModalPropsT= {
  open: boolean;
  onClose: () => void;
  title?: string;
  itemName?: string;
  loading?: boolean;
  fetchBooks:()=>void;
  id:string
}