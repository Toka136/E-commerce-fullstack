import express from "express"
import Wrapper from "../../MiddleWares/Wrapper"
import {  addProductWishListC, deleteProductWC, getWishListC, moveToCartC } from "./WishList.controller"
const router=express.Router()
router.route("/getWishList").get(Wrapper(getWishListC))
router.route("/addProduct").post(Wrapper(addProductWishListC))
router.route("/deleteProduct").delete(Wrapper(deleteProductWC))
router.route("/moveToCart").post(Wrapper(moveToCartC))
export default router