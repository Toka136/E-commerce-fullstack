import express from "express"
import { adminPermision } from "../../MiddleWares/adminPermision"
import Wrapper from "../../MiddleWares/Wrapper"
import { activateCouponC, addCouponC, deactivateCouponC, deleteCouponC, editCouponC, getCouponC, getCouponsC } from "./Coupon.controller"
import { validationSchema } from "../../MiddleWares/Validation"
import { addCouponSchema, editCouponSchema } from "./Coupon.validation"
const router=express.Router()
router.route("/addCoupon").post(adminPermision,validationSchema(addCouponSchema),Wrapper(addCouponC))
router.route("/editCoupon/:id").patch(adminPermision,validationSchema(editCouponSchema),Wrapper(editCouponC))

router.route("/getCoupon/:code").get(adminPermision,Wrapper(getCouponC))
router.route("/deleteCoupon/:id").delete(adminPermision,Wrapper(deleteCouponC))
router.route("/deactivateCoupon/:id").patch(adminPermision,Wrapper(deactivateCouponC))
router.route("/activateCoupon/:id").patch(adminPermision,Wrapper(activateCouponC))
router.route("/getCoupons").get(adminPermision,Wrapper(getCouponsC))
export default router