const express=require('express');
const router=express.Router({ mergeParams: true });
const wrapAsync=require('../utils/wrapAsync');
const {validateReview, isLoggedIn, isOwner, isReviewOwner}=require('../middleware.js');
const reviewController=require('../controllers/reviews.js');



// Submit review

router.post("/",isLoggedIn,validateReview ,reviewController.createReview);

//Delete review
router.delete("/:reviewId",isLoggedIn,isReviewOwner,wrapAsync(reviewController.deleteReview));

module.exports=router;