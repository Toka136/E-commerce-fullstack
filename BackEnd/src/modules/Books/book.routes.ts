import express from "express"
import Wrapper from "../../MiddleWares/Wrapper"
import { addBook_C, deleteBook_C, getBook_C, getBooks_C, updateBook_C } from "./book.controller"
import { imageUpload } from "../../utils/multerCode"
import { adminPermision } from "../../MiddleWares/adminPermision"
const router=express.Router()
router.route("/addBook").post(adminPermision,imageUpload.single("coverImage"),Wrapper(addBook_C))
router.route("/updateBook").patch(adminPermision,imageUpload.single("coverImage"),Wrapper(updateBook_C))
router.route("/deleteBook/:id").delete(adminPermision,Wrapper(deleteBook_C))
router.route("/getBook/:id").get(Wrapper(getBook_C))
router.route("/getBooks/").get(Wrapper(getBooks_C))

export default router