import { addRepoWishList } from "./WishList.types";
import WishListModal from "./WishList.model";
import { ClientSession } from "mongoose";
export const addProductW=async(productId:string,userId:string)=>{
    const wishList=await WishListModal.findOneAndUpdate({userId},{$push:{items:{productId}}},{new:true})
    return wishList

}
export const getWishList=async(userId:string)=>{
    return await WishListModal.findOne({userId})
}
export const getWishListByUserId=async(userId:string,session?:ClientSession)=>{
    const query = WishListModal.findOne({ userId });

    if (session) {
    query.session(session);
    }

    return await query.populate({
    path: "items.productId",
    select: "title coverImage price",
    });
}
export const addEmptyWishList=async(userId:string)=>{
    const  newWishList=new WishListModal({userId:userId,items:[]})
    return await newWishList.save()
}
export const addWishList=async(userId:string,items:string[])=>{
    const  newWishList=new WishListModal({userId:userId,items:items.map(item=>({productId:item}))})
    return await newWishList.save()
}
export const deleteProductW=async(userId:string,productId:string,session?:ClientSession)=>{
    return await WishListModal.findOneAndUpdate({userId},{$pull:{items:{productId}}},{new:true}).session(session??null)
}
export const deleteWishList=async(userId:string)=>{
    return await WishListModal.findOneAndDelete({userId})
}
export const WHasProduct=async(userId:string,productId:string,session?:ClientSession)=>{
     const wishList=await WishListModal.findOne({userId}).session(session??null)
     return wishList!.items.find((item)=>item.productId.toString()===productId)
}