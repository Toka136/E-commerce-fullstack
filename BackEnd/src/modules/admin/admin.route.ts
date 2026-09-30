import express from "express"
import Wrapper from "../../MiddleWares/Wrapper"
import { getCards } from "./admin.controller"
import { adminPermision } from "../../MiddleWares/adminPermision"
const router=express.Router()

router.route("/Cards").get(adminPermision,Wrapper(getCards))

export default router