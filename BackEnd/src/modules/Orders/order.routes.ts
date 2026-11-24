import Wrapper from "../../MiddleWares/Wrapper"
import express from "express"
import { cancelOrderC, changeOrderStatusC, createOrderC, getOrderC, getOrdersC, payOrderC } from "./order.controller"
import { adminPermision } from "../../MiddleWares/adminPermision"
import { validationSchema } from "../../MiddleWares/Validation"
import { orderCreationSchema, orderStatusSchema } from "./orders.Validation"
import { authenticationMiddleware } from "../../MiddleWares/authenticationMiddleware"
const router=express.Router()
router.route("/createOrder").post(authenticationMiddleware,validationSchema(orderCreationSchema),Wrapper(createOrderC))
router.route("/payOrder/:id").post(authenticationMiddleware,Wrapper(payOrderC))
router.route("/getOrders").get(authenticationMiddleware,Wrapper(getOrdersC))
router.route("/getOrder/:id").get(authenticationMiddleware,Wrapper(getOrderC))
router.route("/changeOrderStatus/:id").patch(adminPermision,validationSchema(orderStatusSchema),Wrapper(changeOrderStatusC))
router.route("/cancelOrder/:id").patch(adminPermision,Wrapper(cancelOrderC))

export default router