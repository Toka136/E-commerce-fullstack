import { ObjectId } from "mongodb"

export interface bookI{
    title:string,
    author:string,
    genre:string,
    price:number,
    description:string,
    coverImage:string,
    stock:number,
    _id?:ObjectId
}
export interface editBookI{
    title?:string,
    author?:string,
    genre?:string,
    price?:number,
    description?:string,
    coverImage?:string,
    stock?:number,
    _id:string
}
export interface queryI{
    searchText?:string,
    pageSize?:number,
    currentPage?:number
}