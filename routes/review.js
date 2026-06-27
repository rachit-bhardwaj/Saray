const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsyc.js');
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const { validatereview, isLoggedIn, isReviewAuthor} = require('../middleware.js');
const { createReview } = require('../controller/review.js');
const reviewController = require('../controller/review.js');


// Create Review -> Post route
router.post('/', isLoggedIn, validatereview, wrapAsync(reviewController.createReview)); 

// Delete Review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;