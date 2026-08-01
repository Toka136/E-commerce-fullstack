import express from "express"
import Wrapper from "../../MiddleWares/Wrapper"
import { addReviewC, deleteReviewC, editReviewC } from "./review.controller"
import { editReviewSchema, reviewSchema } from "./review.validation"
import { validationSchema } from "../../MiddleWares/Validation"
import { userPermission } from "../../MiddleWares/userPermission"
import { reviewPermision } from "../../MiddleWares/reviewPermision"
import { deleteReviewPermision } from "../../MiddleWares/deleteReviewPermision"
const router=express.Router()
router.route("/addReview").post(userPermission,validationSchema(reviewSchema),Wrapper(addReviewC))
router.route("/editReview").patch(reviewPermision,validationSchema(editReviewSchema),Wrapper(editReviewC))
router.route("/deleteReview").delete(deleteReviewPermision,validationSchema(editReviewSchema),Wrapper(deleteReviewC))
// router.route("/getReviews").get(Wrapper(getReviewsC))
export default router