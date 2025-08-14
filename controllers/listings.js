const Listing = require("../models/listing");
const mongoose = require("mongoose");
const ExpressError = require('../utils/ExpressError'); 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({accessToken:mapToken});

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.renderNewForm=(req, res) => {
  
    res.render("listings/new");
};

module.exports.createListing=async (req, res) => {
  let response = await geoCodingClient.forwardGeocode({
    query: req.body.listing.location,

    limit: 1  })
  .send();
  console.log(response.body.features[0].geometry);
    if(req.file){
    const url=req.file.path;
  const filename=req.file.filename;
  newListing.image={url,filename};
    }
  const newListing = new Listing(req.body.listing);
  newListing.geometry = response.body.features[0].geometry;
  newListing.owner=req.user._id;
  await newListing.save();
  req.flash("success", "Listing created successfully!");
  
  res.redirect("/listings");
};

module.exports.showListing=async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError("Invalid listing ID format", 400);
  }
const listing = await Listing.findById(id).populate({path:"reviews",
  populate:{
    path:"author",
  }}).populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect(`/listings`);
  }
  res.render("listings/show", { listing });
};

module.exports.editListing=async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Cannot edit, listing not found");
    return res.redirect(`/listings`);  
  };
  res.render("listings/edit", { listing});
};

module.exports.updateListing=async (req, res) => {
  const { id } = req.params;

  
  if (!req.body.listing) {
    throw new ExpressError("Invalid data for update", 400);
  }
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (!updatedListing) {
    req.flash("error", "Listing to update not found");
    return res.redirect(`/listings`);   
  }

//file upload
  if( typeof req.file != "undefined" ){
  const url=req.file.path;
  const filename=req.file.filename;
  updatedListing.image={url,filename};
  await updatedListing.save();
  }


  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req, res) => {
  const { id } = req.params;
  const deleted = await Listing.findByIdAndDelete(id);
  
  if (!deleted) {
    throw new ExpressError("Listing to delete not found", 404);
  }
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};