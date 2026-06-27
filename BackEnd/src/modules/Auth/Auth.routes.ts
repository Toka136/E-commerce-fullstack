import express from "express"
import Wrapper from "../../MiddleWares/Wrapper"
import { C_login, C_logout, C_refreshToken, C_register } from "./Auth.controller"
import { validationSchema } from "../../MiddleWares/Validation"
import { registerSchema } from "./Auth.validation"
import { imageUpload } from "../../utils/multerCode"
const router=express.Router()
router.route("/register").post(imageUpload.single("image"),validationSchema(registerSchema),Wrapper(C_register))
router.route("/login").post(Wrapper(C_login))
router.route("/logout").post(Wrapper(C_logout))
router.route("/refreshToken").post(Wrapper(C_refreshToken))

export default router