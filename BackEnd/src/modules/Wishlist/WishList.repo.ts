import {prisma} from "../../config/prisma"
import { Prisma } from "../../generated/prisma/client"

export const addBookW=async(bookId:string,userId:string)=>{
    const wishList=await prisma.wishList.update({
        where:{userId},
        data:{
            items:{connect:{id:bookId}}
        }
    })
    return wishList

}
export const getWishList=async(userId:string)=>{
    return await prisma.wishList.findUnique({
        where:{userId},
        include: {
      items: {
        select: {
          id: true,
          title: true,
          coverImage: true,
          price: true,
          stock: true,
          author: true,
        },
      },
    },
    })
}
export const getWishListByUserId = async (
  userId: string,
  tx: Prisma.TransactionClient = prisma
) => {
  return tx.wishList.findUnique({
    where: { userId },
    include: {
      items: {
        select: {
          id: true,
          title: true,
          coverImage: true,
          price: true,
          stock: true,
          author: true,
        },
      },
    },
  });
};
export const addEmptyWishList=async(userId:string)=>{
    const newWishList=await prisma.wishList.create({
        data:{userId}
    })
    return  newWishList
}
export const addWishList = async (
  userId: string,
  items: string[]
) => {
    console.log("items",items)
  return await prisma.wishList.create({
    data: {
      userId,
      items: {
        connect: items.map((id) => ({ id })),
      },
    },
  });
};
export const deleteBookW=async(userId:string,bookId:string,tx:Prisma.TransactionClient=prisma)=>{
    return await tx.wishList.update({
        where:{userId},
        data:{
            items:{disconnect:{id:bookId}}
        }
    })
}
export const deleteWishList=async(userId:string)=>{
    return await prisma.wishList.delete({where:{userId}})
}
export const WHasBook = async (
  userId: string,
  bookId: string,
  tx: Prisma.TransactionClient = prisma
) => {
  const wishList = await tx.wishList.findFirst({
    where: {
      userId,
      items: {
        some: {
          id: bookId,
        },
      },
    },
    select: {
      id: true,
    },
  });

  return wishList ;
};