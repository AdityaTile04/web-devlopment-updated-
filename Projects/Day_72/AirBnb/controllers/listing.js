const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

exports.indexRoute = async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (error) {
    req.flash("error", "Could not fetch listings.");
    res.redirect("/");
  }
};

exports.newFormRoute = (req, res) => {
  res.render("listings/new.ejs");
};

exports.showRoute = async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  } catch (error) {
    req.flash("error", "Could not find the listing.");
    res.redirect("/listings");
  }
};

exports.createListing = async (req, res) => {
  try {
    if (!req.body.listing.location) {
      req.flash("error", "Location is required.");
      return res.redirect("/listings/new");
    }

    const response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    if (!response.body.features.length) {
      req.flash("error", "Location could not be found.");
      return res.redirect("/listings/new");
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.img = { url: req.file.path, filename: req.file.filename };
    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();
    req.flash("success", "New Listing Added");
    res.redirect("/listings");
  } catch (error) {
    console.error(error); // Log the error for debugging
    req.flash("error", "Could not create listing.");
    res.redirect("/listings/new");
  }
};

exports.deleteRoute = async (req, res) => {
  const { id } = req.params;
  try {
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
  } catch (error) {
    req.flash("error", "Could not delete listing.");
    res.redirect("/listings");
  }
};
