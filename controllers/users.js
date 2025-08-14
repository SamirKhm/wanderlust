const User = require('../models/user.js');          // Your Mongoose User model with passport-local-mongoose


module.exports.signupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res,next)=>{
    try{
        let {username,email,password}=req.body;
    const newUser = new User({email,username});
    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","welcome to Wanderlust , Registered successfully");
    res.redirect("/listings");
    });
    
    }
    catch(e){
        req.flash("error",e.message)
        res.redirect("/signup");
    }
};

module.exports.loginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=(req,res)=>{
    req.flash("success","Welcome to wanderlust , you are logged in")
    // `console.log(req.user);`
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/login");
    })
};