export interface cartI{
   productId:string,
    token:string,
    quantity?:number
}
export interface insertCartI{
    userId:string,
   productId:string,
    quantity?:number,
    price:number
}