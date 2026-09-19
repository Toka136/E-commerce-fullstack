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
router.route("/getAddresses").get(authenticationMiddleware,Wrapper(getAddressesC))
router.route("/getAddress").get(authenticationMiddleware,Wrapper(getAddressC))
router.route("/updateAddress/:addressId").patch(authenticationMiddleware,addressPermision,validationSchema(updateSchema),Wrapper(updateAddressC))
router.route("/deleteAddress/:addressId").delete(authenticationMiddleware,addressPermision,Wrapper(deleteAddressC))
router.route("/setDefault/:addressId").patch(authenticationMiddleware,addressPermision,Wrapper(setAddressDefaultC))
export default router