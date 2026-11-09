import express from "express"
import Wrapper from "../../MiddleWares/Wrapper"
import { addCouponToCartC, addProductInCartC, getCartC, removeCouponFromCartC, removeProductFromCartC, updateProductInCartC } from "./Cart.controller"
import { authenticationMiddleware } from "../../MiddleWares/authenticationMiddleware"
const router=express.Router()
router.route("/addProductIntoCart").post(authenticationMiddleware,Wrapper(addProductInCartC))
router.route("/updateCart").post(authenticationMiddleware,Wrapper(updateProductInCartC))

router.route("/getCart").get(authenticationMiddleware,Wrapper(getCartC))
router.route("/removeProductFromCart").patch(authenticationMiddleware,Wrapper(removeProductFromCartC))
router.route("/applyCoupon").patch(authenticationMiddleware,Wrapper(addCouponToCartC))
router.route("/removeCoupon").patch(authenticationMiddleware,Wrapper(removeCouponFromCartC))
export default router