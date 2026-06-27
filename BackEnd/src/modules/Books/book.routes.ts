import express from "express"
import Wrapper from "../../MiddleWares/Wrapper"
import { addBook_C } from "./book.controller"
import { imageUpload } from "../../utils/multerCode"
import { adminPermision } from "../../MiddleWares/adminPermision"
const router=express.Router()
router.route("/addBook").post(adminPermision,imageUpload.single("coverImage"),Wrapper(addBook_C))
export default router