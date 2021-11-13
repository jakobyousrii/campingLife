const User = require("../models/user");

module.exports.register = async(req,res)=>{

    res.render("auth/register");
}

module.exports.registerPost = async(req,res,next)=>{
    try{
    const {password} = req.body;
    const user = new User(req.body.user);
    const authUser = await User.register(user, password);
    console.log(authUser);
    req.login(authUser,err=>{if(err) return next(err);
        req.flash("success", `welcome to campLife, ${req.user.username}!`);
        res.redirect("/campgrounds")
    });
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/register");
    }
}

module.exports.login = async(req,res)=>{

    res.render("auth/login");
}

module.exports.loginPost = async(req,res)=>{
    req.flash("success",`Welcome back, ${req.user.username}!`);
    const url = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(url);
}

module.exports.logout = async(req,res)=>{
    req.logout();
    req.flash("success","Logged out!");
    res.redirect("/campgrounds");
}