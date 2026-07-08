import express from "express"
import Wrapper from "../../MiddleWares/Wrapper"
import { addProductInCartC, decreaseQuantityC, getCartC, removeProductFromCartC } from "./Cart.controller"
const router=express.Router()
router.route("/addProductIntoCart").post(Wrapper(addProductInCartC))
router.route("/getCart").get(Wrapper(getCartC))
router.route("/removeProductFromCart").patch(Wrapper(removeProductFromCartC))
router.route("/decreaseQuantity").patch(Wrapper(decreaseQuantityC))
export default router