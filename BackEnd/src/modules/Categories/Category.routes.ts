import express from "express"
import { addCategoryC, deleteCategoryC, getCategoriesC, getCategoryC, updateCategoryC } from "./Category.controller"
import Wrapper from "../../MiddleWares/Wrapper"
import { adminPermision } from "../../MiddleWares/adminPermision"
const routes=express.Router()
routes.route("/addCategory").post(adminPermision,Wrapper(addCategoryC))
routes.route("/getCategories").get(Wrapper(getCategoriesC))
routes.route("/getCategory/:slug").get(Wrapper(getCategoryC))
routes.route("/deleteCategory/:id").delete(adminPermision,Wrapper(deleteCategoryC))
routes.route("/updateCategory/:slug").patch(adminPermision,Wrapper(updateCategoryC))
export default routes