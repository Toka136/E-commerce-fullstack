import express from "express"
import Wrapper from "../../MiddleWares/Wrapper"
import { addProductInCartC, getCartC, removeProductFromCartC } from "./Cart.controller"
const router=express.Router()
router.route("/addProductIntoCart").post(Wrapper(addProductInCartC))
router.route("/getCart").get(Wrapper(getCartC))
router.route("/removeProductFromCart").patch(Wrapper(removeProductFromCartC))
export default router