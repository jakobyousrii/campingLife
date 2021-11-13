const baseJoi = require("joi");
const AsyncError = require("./utils/AsyncError");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!"
    },
    rules: {
        escapeHTML:{
            validate(value,helpers){
                const clean = sanitizeHtml(value,{allowedTags:[],allowedAtributes:{}});
                if(clean !== value) return helpers.error("string.escapeHTML",{value})
                return clean; 
            }
        }
    }
});

const Joi = baseJoi.extend(extension);

module.exports.campgroundJoi= (req,res,next)=>{
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required().escapeHTML(),
            price: Joi.number().required().min(0),
            // image: Joi.string().required(),
            location: Joi.string().required().escapeHTML(),
            description: Joi.string().required().escapeHTML()
        }).required(),
        deletePhotos: Joi.array()
        })
        const {error} = campgroundSchema.validate(req.body);
        if(error){
            const msg = error.details.map(el => el.message).join(",");
            throw new AsyncError(msg,404);
        } 
        else{
            next()
        }
}

module.exports.reviewJoi = (req,res,next)=>{
    const reviewSchema = Joi.object({
        review: Joi.object({
            rating: Joi.number().min(1).max(5).required(),
            text: Joi.string().required().escapeHTML()
        }).required()
    })
    const {error} = reviewSchema.validate(req.body);
        if(error){
            const msg = error.details.map(el => el.message).join(",");
            throw new AsyncError(msg,404);
        } 
        else{
            next()
        }
}

