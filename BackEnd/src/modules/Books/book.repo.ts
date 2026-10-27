import {prisma} from "../../config/prisma"
import { Prisma } from "../../generated/prisma/client";
import { bookI, editBookI, insertBookI, queryI } from "./book.types"
export const findBookByName=async(title:string)=>{
    return await prisma.book.findUnique({where:{title}})
}
export const insertBook = async (book: insertBookI) => {
  return await prisma.book.create({
    data: {...book,rate:{
      create:{}
    }},
  });
};
export const findBookById=async(id:string)=>{
  return await prisma.book.findUnique({where:{id} ,
    include:{category:{omit:{description:true}},rate:{select:{average:true,count:true}}}})
 
}
export const findOnlyBookById=async(id:string,tx:Prisma.TransactionClient=prisma)=>{
  return await tx.book.findUnique({where:{id}})
  
}
export const updateBook=async(book:insertBookI,id:string)=>{
  return await prisma.book.update({where:{id},data:book})
    
}
export const deleteBook=async(id:string)=>{
    return await prisma.book.delete({where:{id}})
}
export const findBooks=async(query:queryI,skip:number,filter:any,sort?:any)=>{
  return await prisma.book.findMany({
  where: filter,
  include: {
    category: {
      omit:{
        description:true
      }
    },
  },
  orderBy: sort,
  skip,
  take: query.pageSize!,
});
   
}
export const getBooksCount=async(filter:any)=>{
  return await prisma.book.count({
    where:filter
  })
}
// export const findOrderBooks=async(orderBooksIds:string[],session:ClientSession)=>{
//     return await Book.find({_id:{$in:orderBooksIds}},null,{session})
// }
// export const updateStock=async(bookId:string,quantity:number,session:ClientSession)=>{
//     const result=await Book.findByIdAndUpdate(bookId,{$inc:{stock:-quantity}},{new:true,session})
//     return result
// }
export const getBooksbyCategory=async(category:string)=>{
    return await prisma.book.findMany({where:{categoryId:category}})
}
export const addRate = async (bookId: string, rate: number) => {
  const currentRate = await prisma.bookRate.findUnique({
    where: { bookId },
  });

  if (!currentRate) {
    throw new Error("Book rate not found");
  }

  const newCount = currentRate.count + 1;

  const newAverage =
    (currentRate.average * currentRate.count + rate) / newCount;

  return await prisma.bookRate.update({
    where: { bookId },
    data: {
      average: newAverage,
      count: newCount,
    },
  });
};
export const editRate=async(bookId:string,rate:number,oldRate:number)=>{
  const currentRate = await prisma.bookRate.findUnique({
    where: { bookId },
  });

  if (!currentRate) {
    throw new Error("Book rate not found");
  }
  const newAverage=
    (currentRate.average * currentRate.count - oldRate + rate) / currentRate.count
  return await prisma.bookRate.update({
    where: { bookId },
    data: {
      average: newAverage,
    },
  });
}
export const deleteRate = async (bookId: string, rate: number) => {
  const currentRate = await prisma.bookRate.findUnique({
    where: { bookId },
  });

  if (!currentRate) {
    throw new Error("Book rate not found");
  }
  const newAverage=
    (currentRate.average * currentRate.count - rate) / (currentRate.count-1)

  return await prisma.bookRate.update({
    where: { bookId },
    data: {
      average: newAverage,
      count: currentRate.count - 1,
    },
  });
};