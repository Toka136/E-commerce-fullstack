export interface bookI{
    title:string,
    author:string,
    genre:string,
    price:number,
    description:string,
    coverImage:string,
    stock:number
}
export interface editBookI{
    title?:string,
    author?:string,
    genre?:string,
    price?:number,
    description?:string,
    coverImage?:string,
    stock?:number,
    id:string
}
export interface queryI{
    searchText?:string,
    pageSize?:number,
    currentPage?:number
}