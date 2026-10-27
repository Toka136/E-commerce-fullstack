import express from "express"
import Wrapper from "../../MiddleWares/Wrapper"
import {  addBookWishListC, deleteBookWC, getWishListC, moveToCartC } from "./WishList.controller"
import { authenticationMiddleware } from "../../MiddleWares/authenticationMiddleware"
const router=express.Router()
router.route("/getWishList").get(authenticationMiddleware,Wrapper(getWishListC))
router.route("/addBook").post(authenticationMiddleware,Wrapper(addBookWishListC))
router.route("/deleteBook").delete(authenticationMiddleware,Wrapper(deleteBookWC))
router.route("/moveToCart").post(authenticationMiddleware,Wrapper(moveToCartC))
export default router