import { ObjectId } from "mongodb"
import { Prisma } from "../../generated/prisma/client";

export interface bookI{
    title:string,
    author:string,
    price:Prisma.Decimal ,
    description:string,
    coverImage:string,
    stock:number,
    id?:string,
    pages:number,
    imagePublicId?:string
}
export interface addBookBodyI extends bookI{
    slug:string,
    
}
export interface insertBookI extends bookI{
     categoryId: string;

    
}
export interface editBookI{
    title?:string,
    author?:string,
    slug?:string,
    price?:Prisma.Decimal,
    description?:string,
    coverImage?:string,
    stock?:number,
    id:string,
    pages?:number
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