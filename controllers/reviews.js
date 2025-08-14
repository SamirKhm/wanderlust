const Review=require('../models/review');
const Listing = require('../models/listing.js');
const {reviewSchema}=require('../schema.js');
const ExpressError = require('../utils/ExpressError'); 

module.exports.createReview=async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author=req.user._id;
  await newReview.save();
  listing.reviews.push(newReview._id);
  await listing.save();
  req.flash("success","Review submitted successfully");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview=async(req,res)=>{

  let {id,reviewId}=req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { new: true });
  console.log("Deleting review", reviewId, "from listing", id);
  req.flash("success","Review deleted successfully");
  res.redirect(`/listings/${id}`);

};
