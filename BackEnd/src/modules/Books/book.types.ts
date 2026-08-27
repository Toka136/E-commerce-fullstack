import { ObjectId } from "mongodb"

export interface bookI{
    title:string,
    author:string,
    price:number,
    description:string,
    coverImage:string,
    stock:number,
    _id?:ObjectId,
    pages:number
}
export interface addBookBodyI extends bookI{
    slug:string,
    
}
export interface insertBookI extends bookI{
    category:ObjectId
    
}
export interface editBookI{
    title?:string,
    author?:string,
    slug?:string,
    price?:number,
    description?:string,
    coverImage?:string,
    stock?:number,
    _id:string,
    pages:number
}
export interface queryI{
     pageSize?: number;
    currentPage?: number;
    searchText?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
}