const express=require('express');
const router = express.Router({mergeParams: true});

const Joi = require('joi');
const { reviewSchema} = require('../schemas.js');
const {IsloggedIn }=require('../auth.js');

const wrapAsync = require('../utility/wrapAsync.js');
const ExpressError = require('../utility/expressError.js');

const Campground=require('../module/campgrounds.js');
const Review=require('../module/review.js');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
  }

  router.post('/', IsloggedIn , validateReview, wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))
    
    router.delete('/:reviewId', wrapAsync(async (req,res) => {
      const { id, reviewId } = req.params;
      await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId)
      req.flash('success', 'Review deleted sucessfully');
res.redirect(`/campgrounds/${id}`)
      }))
      module.exports=router;