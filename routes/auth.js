const express = require("express");
const router = express.Router();
const catchAsync  =require("../utils/catchAsync");
const passport = require("passport");
const {register, registerPost, login, loginPost,logout} = require("../controllers/auth");

router.route("/register")
.get(catchAsync(register))
.post(catchAsync(registerPost));

router.route("/login")
.get(catchAsync(login))
.post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}),catchAsync(loginPost));

router.get("/logout", catchAsync(logout))

module.exports = router;