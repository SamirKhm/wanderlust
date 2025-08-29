const wrapAsync=require('../utils/wrapAsync');
const express=require('express');
const router=express.Router();
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const {storage} = require('../cloudConfig.js')
const multer  = require('multer');
const upload = multer({ storage});
 

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        validateListing,
        upload.single('listing[image]'), 
        wrapAsync(listingController.createListing));
    
// New listing form
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.get("/search",wrapAsync(listingController.searchListing));

router  
    .route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put(isLoggedIn,upload.single('listing[image]'),isOwner,validateListing ,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

// Edit listing form
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.editListing));

module.exports=router;