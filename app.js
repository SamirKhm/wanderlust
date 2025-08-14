require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');  
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.use(express.static('public'));
const ExpressError = require('./utils/ExpressError'); 
const listings=require('./routes/listing.js');
const reviews=require('./routes/review.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy=require('passport-local');
const User = require("./models/user.js")
const user=require("./routes/user.js");
const MongoStore = require("connect-mongo");
const dbUrl= process.env.ATLASDB_URL;

main()
  .then(() => console.log('Connected to MongoDB!')) 
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs',ejsMate);

// Root Route
// app.get("/", (req, res) => {
//   res.send("Welcome to the Root");
// });

const store = MongoStore.create({
  mongoUrl : dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})

store.on("error",()=>{
  console.log("Error in mongo session store");
})

app.get('/', (req, res) => {
  res.render('index.ejs'); // this looks for views/index.ejs
});

//Sessions and cookies
const sessionOptions = {
  store,
  secret: process.env.SECRET,      // Replace with a secure, random secret in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,               // Prevents client-side JS from accessing the cookie
    maxAge: 1000 * 60 * 60        // 1 hour in milliseconds
  }
};

app.use(session(sessionOptions));

// passport configuration

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Flash function
app.use(flash());
app.use(function(req, res, next) {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currUser=req.user;
  next();
})


app.get("/demouser",async (req,res)=>{
  let fakeUser = new User({
    email:"student@gmail.com",
    username:"Student"
  });
  let registeredUser = await User.register(fakeUser,"helloworld");
  res.send(registeredUser);
});



//Routes for listing and reviews
app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);

// Catch-all for undefined routes
app.all("/:path", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { err });
});

// Start server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

// app.get("/testListing", async (req, res) => {

// let sampleListing = new Listing({
// title: "My New Villa",
// description: "By the beach",
// price: 1200,
// location: "Calangute, Goa",
// country: "India",
// });

// await sampleListing.save();
// console.log("sample was saved");
// res.send("successful testing");
// });
