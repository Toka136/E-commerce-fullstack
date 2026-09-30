import express from "express"
import Wrapper from "../../MiddleWares/Wrapper"
import { resetPasswordC, sendResetPasswordLinkC } from "./resetPassword.controller"
const router=express.Router()
router.route("/resetLink").post(Wrapper(sendResetPasswordLinkC))
router.route("/resetPassword").post(Wrapper(resetPasswordC))
export default router