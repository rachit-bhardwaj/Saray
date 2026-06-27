const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsyc.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validatelisting } = require('../middleware.js');
const listingController = require('../controller/listing.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

// router the similar route -> '/'
router.route('/')
    .get(wrapAsync(listingController.index))  // //Index.ejs show all titles
    .post(isLoggedIn,
        upload.single('listing[image]'),
        validatelisting,
        wrapAsync(listingController.createListing));  // Create  -> for new listing


// Create  -> for new listing.ejs
router.get('/new', isLoggedIn, listingController.renderNewForm);

// router the similar route -> '/:id'
router.route('/:id')
    .get(wrapAsync(listingController.showListing)) //show.ejs individual all details
    .patch(isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validatelisting,
        wrapAsync(listingController.updateListing)) //update listing route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));  //Delete Route

// edit.ejs route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditListing));


module.exports = router;