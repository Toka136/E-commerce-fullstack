import express from "express"
import Wrapper from "../../MiddleWares/Wrapper"
import { addAddressC, getAddressesC,getAddressC, updateAddressC, deleteAddressC, setAddressDefaultC } from "./Address.controller"
import { validationSchema } from "../../MiddleWares/Validation"
import { addSchema, updateSchema } from "./Address.validation"
import { authenticationMiddleware } from "../../MiddleWares/authenticationMiddleware"
import { addressPermision } from "../../MiddleWares/addressPermision"
import { set } from "mongoose"

const router=express.Router()
router.route("/addAddress").post(validationSchema(addSchema),Wrapper(addAddressC))
router.route("/getAddresses").get(Wrapper(getAddressesC))
router.route("/getAddress").get(Wrapper(getAddressC))
router.route("/updateAddress").patch(authenticationMiddleware,addressPermision,validationSchema(updateSchema),Wrapper(updateAddressC))
router.route("/deleteAddress").delete(authenticationMiddleware,addressPermision,Wrapper(deleteAddressC))
router.route("/setDefault").patch(authenticationMiddleware,addressPermision,Wrapper(setAddressDefaultC))
export default router