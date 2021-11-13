const { cloudinary } = require("../cloudinary");
const Campground = require("../models/campground");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });



module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
    
}

module.exports.newForm = async(req, res) => {
    res.render('campgrounds/new');
}

module.exports.newPost = async (req, res) => {
    //GEO DATA
    const geography = await geoCoder.forwardGeocode({ query:req.body.campground.location, limit: 1}).send();

    const campground = new Campground(req.body.campground);
    campground.images = req.files.map((f)=>({ url: f.path, filename: f.filename }))
    campground.author = req.user;
    campground.geometry = geography.body.features[0].geometry;
    await campground.save();
    console.log(campground)
    req.flash("success","Campground has been created!");
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.show = async(req, res,next) => {

    const campground = await Campground.findById(req.params.id).populate({path:"reviews",populate:"author"}).populate("author");
    if(campground){
    return res.render('campgrounds/show', { campground});
    }
    // throw new AsyncError("Cannot find campground!",404);
    req.flash("error","That campground doesn't exist!")
    res.redirect("/campgrounds")
}

module.exports.edit = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}

module.exports.putEdit = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground});
    if(campground.location !== req.body.campground.location){
        const geography = await geoCoder.forwardGeocode({ query:req.body.campground.location, limit: 1}).send();
        campground.geometry = geography.body.features[0].geometry;
    }
    const data = req.files.map((f)=>({ url: f.path, filename: f.filename }));
    campground.images.push(...data);
    if(req.body.deletePhotos){
        for(let delPhotos of req.body.deletePhotos){
            await cloudinary.uploader.destroy(delPhotos);
        }
    await campground.updateOne({$pull:{images:{filename:{$in: req.body.deletePhotos}}}})
    console.log(campground);
    }
    await campground.save();
    req.flash("success","campground has been updated!");
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success","campground has been deleted!");
    res.redirect('/campgrounds');
};