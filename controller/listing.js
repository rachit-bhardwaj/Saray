const Listing = require('../models/listing');
const { geocoding, config } = require("@maptiler/client");
config.apiKey = process.env.MAPTILER_API_KEY;

// index controller
module.exports.index = async (req, res, next) => {
    let search = req.query.search;

let allListing;

if(search){
    allListing = await Listing.find({
        $or: [
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } }
        ]
    });
} else {
    allListing = await Listing.find({});
}
    res.render('./listings/index.ejs', { allListing, search });
};

// new listing form controller
module.exports.renderNewForm = (req, res) => {
    res.render('./listings/new.ejs');
};

// create new listing controller
module.exports.createListing = async (req, res, next) => {

      // Convert location to coordinates
    const geoData = await geocoding.forward(
        `${req.body.listing.location}, ${req.body.listing.country}`,
        { limit: 1 }
    );

    
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

      // Save GeoJSON coordinates
    newListing.geometry = geoData.features[0].geometry;

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect('/listings');
};

//show controller
module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const show = await Listing.findById(id)
        .populate({ path: 'reviews', populate: { path: "author" } })
        .populate('owner');
    if (!show) {
        req.flash('error', 'Listing you requested for does not exist!');
        return res.redirect('/listings');
    }
   res.render("./listings/show.ejs", {
    show,
    mapApiKey: process.env.MAPTILER_API_KEY
});
};

// edit listing form controller
module.exports.renderEditListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing you requested for does not exist!');
        return res.redirect('/listings');
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace('/upload', '/upload/w_250');
    res.render('./listings/edit.ejs', { listing, originalImageUrl });
};

// update listing controller
module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true, returnDocument: "after" });
    if (typeof req.file !== 'undefined') {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

// delete listing
module.exports.deleteListing = async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect(`/listings`);
};