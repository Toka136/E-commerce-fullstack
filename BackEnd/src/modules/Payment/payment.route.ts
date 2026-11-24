import express from "express"
const route=express.Router()
import Wrapper from "../../MiddleWares/Wrapper"
import { getPaymentDetailsC, getPaymentMethodsC } from "./payment.controller"
import { authenticationMiddleware } from "../../MiddleWares/authenticationMiddleware"
route.route("/getPaymentMethods").get(authenticationMiddleware,Wrapper(getPaymentMethodsC))
route.route("/getPaymenDetails/:id").get(authenticationMiddleware,Wrapper(getPaymentDetailsC))

export default route