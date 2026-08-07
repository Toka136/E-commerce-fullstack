import { ObjectId } from "mongodb"
import { GetUserInfo } from "../../utils/userInfo"
import { addEmptyWishList, addProductW, addWishList, deleteProductW, getWishListByUserId, WHasProduct } from "./WishList.repo"
import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"
import mongoose, { ClientSession } from "mongoose"
import { findBookById, findOnlyBookById } from "../Books/book.repo"
import { addProductInCart_S } from "../Cart/Cart.service"
import { findCartByUserId, insertCart } from "../Cart/Cart.repo"

export const getWishListS=async(token:string)=>{
    const userInfo=await GetUserInfo(token)
    const userId=new ObjectId(userInfo.id).toString()
    const res =await getWishListByUserId(userId)
    if(!res){
        const newWishList=await addEmptyWishList(userId)
        return newWishList
    }
    return res
}
export const addProductWishListS=async(token:string,productId:string)=>{
    const userInfo=await GetUserInfo(token)
    const userId=userInfo.id.toString()
    const wishList=await getWishListByUserId(userId)
    const hasProduct=await WHasProduct(userId,productId)
    if(hasProduct){
        return hasProduct.productId
    }
    if(!wishList){
     await addWishList(userId,[productId])
     return productId
    }
    await addProductW(productId,userId)     
    return productId

}
export const deleteProductWS=async(token:string,productId:string)=>{
    const userInfo=await GetUserInfo(token)
    const userId=userInfo.id.toString()
  
    await deleteProductW(userId,productId)
    return productId
}
export const moveToCartS = async (token: string, productId: string) => {
  const userInfo = await GetUserInfo(token);
  const userId = userInfo.id.toString();

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const wishList = await getWishListByUserId(userId, session);

    if (!wishList) {
      throw new appError("WishList Not Found", 404, responseStatus.FAILED);
    }

    const hasProduct = await WHasProduct(userId, productId, session);

    if (!hasProduct) {
      throw new appError("Product Not Found In Wishlist", 404, responseStatus.FAILED);
    }

    const product = await findOnlyBookById(productId, session);

    if (!product) {
      throw new appError("Product Not Found", 404, responseStatus.FAILED);
    }

    if (product.stock <= 0) {
      throw new appError("Product Out Of Stock", 400, responseStatus.FAILED);
    }
    await addProductIntoCartW_S(
        userId,
        productId,
        product.price,
        session,
    );

    await deleteProductW(userId, productId, session);

    await session.commitTransaction();

    return productId;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};
export const addProductIntoCartW_S = async (
  userId: string,
  productId: string,
  price: number,
  session?: ClientSession,
  
) => {
  const cart = await findCartByUserId(userId, session);
  if (!cart) {
    return await insertCart(
      {
        userId,
        productId,
        price
      },
      session
    );
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (item) {
    item.quantity++;
  } else {
    cart.items.push({
      product: productId,
      quantity: 1,
    });
  }

if (session) {
  await cart.save({ session });
} else {
  await cart.save();
}
  return cart;
};
  