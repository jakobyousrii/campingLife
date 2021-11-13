const Campground = require("./models/campground");
const Review = require("./models/review");

//MIDDLEWARE ISLOGGEDIN
module.exports.isLoggedIn = async(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash("error","You are not logged in!");
        res.redirect("/login");
    }
    else{
        next();
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    if(req.isAuthenticated()){
        const campground = await Campground.findById(id);
        if(campground.author._id.equals(req.user._id)){
            next();
        }
        else{
            req.flash("error","You don't have permission to do that!");
            res.redirect("/campgrounds");
        }
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {reviewId} = req.params;
    const review = await Review.findById(reviewId);

        if(req.user && req.user._id.equals(review.author._id)){
            next();
        }
        else{
            req.flash("error","You don't have permission to do that!");
            res.redirect("/campgrounds");
        }
    }
