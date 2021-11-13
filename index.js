if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
// const Campground = require('./models/campground');
// const Review = require("./models/review");
const ejsMate = require("ejs-mate");
const AsyncError = require("./utils/AsyncError");
const catchAsync = require("./utils/catchAsync");
// const {campgroundJoi,reviewJoi} = mongooseSchemaJoi;
const campgroundRouter = require("./routes/campgrounds");
const reviewRouter = require("./routes/reviews");
const session = require("express-session");
const flash =require("connect-flash")
const authRoutes = require("./routes/auth");
//Authentication
const passport = require("passport")
const LocalStrategy  = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/campersLife";

mongoose.connect(dbUrl)
.then(()=>{
    console.log("Database connected!");
})
.catch(e =>{
    console.log("cannot connect database",e);
})  

app.engine("ejs",ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

const secret = process.env.SECRET || "thisIsSecret"

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

const sessionOption = {
    store,
    name: "Session",
    secret, 
    resave: false, 
    saveUninitialized: true, 
    cookie: { httpOnly:true, expires: Date.now() + 8000, maxAge: 1000*60*60*24*7}} //secure:true}}

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public")));
app.use(session(sessionOption));
app.use(flash());
app.use(mongoSanitize());
app.use(helmet());



const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://code.jquery.com/jquery-3.3.1.slim.min.js",
    "'self' https://use.fontawesome.com"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "fonts.googleapis.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    " fonts.googleapis.com",
    "fonts.gstatic.com",
];
const fontSrcUrls = [
"fonts.gstatic.com",
"fonts.googleapis.com"
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dtbzkm9ef/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "fonts.gstatic.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


//authentication config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    next();
})

app.get('/', async(req, res) => {
    res.render('home');
});

app.use("/campgrounds",campgroundRouter);
app.use("/campgrounds/:id/reviews", reviewRouter);
app.use("/",authRoutes);


app.all("*", catchAsync(async(req,res,next)=>{
    throw new AsyncError("404, page not found! :(", 404);
}));

app.use((err,req,res,next)=>{
   const {status =200} = err;
   if(!err.message){
       err.message = "Something went wrong!"
   }
    return res.status(status).render("err",{err});
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on the port:${port}`)
})