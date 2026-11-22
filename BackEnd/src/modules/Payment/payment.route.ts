import express from "express"
const route=express.Router()
import Wrapper from "../../MiddleWares/Wrapper"
import { getPaymentMethodsC } from "./payment.controller"
import { authenticationMiddleware } from "../../MiddleWares/authenticationMiddleware"
route.route("/paymentMethods").get(authenticationMiddleware,Wrapper(getPaymentMethodsC))
export default route