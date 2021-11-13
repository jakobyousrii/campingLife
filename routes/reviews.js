const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const {reviewJoi} = require("../mongooseSchemaJoi")
const {isLoggedIn,isReviewAuthor} = require("../middleware");
const {createReview, deleteReview} = require("../controllers/reviews");

router.post("/",reviewJoi,isLoggedIn,catchAsync(createReview));


router.delete("/:reviewId", isLoggedIn,isReviewAuthor,catchAsync(deleteReview));


module.exports = router;