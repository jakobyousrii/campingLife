const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const AsyncError = require("../utils/AsyncError")
const {campgroundJoi} = require("../mongooseSchemaJoi");
const {isLoggedIn,isAuthor} = require("../middleware");
const {index, newForm, newPost,show, edit, putEdit, deleteCampground} = require("../controllers/campgrounds");
const multer  = require('multer')
const {storage} = require("../cloudinary/index");
const upload = multer({storage})


router.route("/")
.get(catchAsync(index))
.post(isLoggedIn,upload.array("image"), campgroundJoi,catchAsync(newPost));


router.get('/new',isLoggedIn, catchAsync(newForm));

router.route("/:id")
.get(catchAsync(show))
.put(isLoggedIn, isAuthor, upload.array("image"), campgroundJoi,catchAsync(putEdit))
.delete(isLoggedIn, isAuthor, catchAsync(deleteCampground));

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(edit))


module.exports = router;