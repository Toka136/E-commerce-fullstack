import { Prisma } from "../../generated/prisma/client";

export interface cartI{
   bookId:string,
    userId:string,
    quantity?:number
}
export interface insertCartI {
  userId: string;
  bookId: string;
  quantity?: number;
  price: Prisma.Decimal;
}