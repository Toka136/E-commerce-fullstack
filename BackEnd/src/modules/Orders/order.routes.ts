import Wrapper from "../../MiddleWares/Wrapper"
import express from "express"
import { changeOrderStatusC, createOrderC, getOrderC, getOrdersC } from "./order.controller"
import { adminPermision } from "../../MiddleWares/adminPermision"
import { validationSchema } from "../../MiddleWares/Validation"
import { orderStatusSchema } from "./orders.Validation"
import { authenticationMiddleware } from "../../MiddleWares/authenticationMiddleware"
const router=express.Router()
router.route("/createOrder").post(authenticationMiddleware,Wrapper(createOrderC))
router.route("/getOrders").get(authenticationMiddleware,Wrapper(getOrdersC))
router.route("/getOrder/:id").get(authenticationMiddleware,Wrapper(getOrderC))
router.route("/changeOrderStatus/:id").patch(adminPermision,validationSchema(orderStatusSchema),Wrapper(changeOrderStatusC))
export default router