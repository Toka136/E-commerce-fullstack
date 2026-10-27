import express from "express"
import Wrapper from "../../MiddleWares/Wrapper"
import { getUserProfileC, updateProfileC } from "./profile.controller"
import { authenticationMiddleware } from "../../MiddleWares/authenticationMiddleware"
import { validationSchema } from "../../MiddleWares/Validation"
import { updateProfileSchema } from "./profile.validation"
import { imageUpload } from "../../utils/multerCode"
const router=express.Router()
router.route("/getProfile").get(authenticationMiddleware,Wrapper(getUserProfileC))
router.route("/updateProfile").patch(authenticationMiddleware,imageUpload.single("image"),validationSchema(updateProfileSchema),Wrapper(updateProfileC))
export default router