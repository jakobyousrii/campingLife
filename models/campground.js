const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review");

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual("thumbnail").get(function(){
   return this.url.replace("/upload","/upload/w_150,h_100/")
});

imageSchema.virtual("showImg").get(function(){
    return this.url.replace("/upload","/upload/ar_1.0,c_fill,g_east,h_1500/")
 });
 

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: {
        type: String,
    },
    images: [imageSchema],
    price: {
        type: Number,
    },

    description: {
        type: String,
    },

    location: {
        type: String,
    },
    reviews: [{ type:Schema.Types.ObjectId, ref:"Review"}],
    author: {type: Schema.Types.ObjectId, ref:"User"},
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
},opts);


CampgroundSchema.virtual("properties.markUp").get(function(){

    return  `<strong>${this.title}</strong><p>${this.location}</p> <a href=/campgrounds/${this._id}>See Campground</a>`

});

CampgroundSchema.post("findOneAndDelete",async(doc)=>{
    if(doc){
    await Review.deleteMany({_id: {$in: doc.reviews}})
    // for(let r of doc.reviews){
    //   const rev = await Review.findByIdAndDelete(r._id);
    // }
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);


