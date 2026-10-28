import express from "express"
import Wrapper from "../../MiddleWares/Wrapper"
import { addProductInCartC, getCartC, removeProductFromCartC, updateProductInCartC } from "./Cart.controller"
import { authenticationMiddleware } from "../../MiddleWares/authenticationMiddleware"
const router=express.Router()
router.route("/addProductIntoCart").post(authenticationMiddleware,Wrapper(addProductInCartC))
router.route("/updateCart").post(authenticationMiddleware,Wrapper(updateProductInCartC))

router.route("/getCart").get(authenticationMiddleware,Wrapper(getCartC))
router.route("/removeProductFromCart").patch(authenticationMiddleware,Wrapper(removeProductFromCartC))
export default router