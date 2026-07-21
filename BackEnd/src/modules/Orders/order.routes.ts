import Wrapper from "../../MiddleWares/Wrapper"
import express from "express"
import { changeOrderStatusC, createOrderC, getOrdersC } from "./order.controller"
import { adminPermision } from "../../MiddleWares/adminPermision"
import { validationSchema } from "../../MiddleWares/Validation"
import { orderStatusSchema } from "./orders.Validation"
const router=express.Router()
router.route("/createOrder").post(Wrapper(createOrderC))
router.route("/getOrders").get(Wrapper(getOrdersC))
router.route("/changeOrderStatus/:id").patch(adminPermision,validationSchema(orderStatusSchema),Wrapper(changeOrderStatusC))
export default router