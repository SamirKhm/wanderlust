const express=require('express');
const app=express();
const session = require('express-session');
const sessionOptions = {
    resave: false,
    saveUninitialized: true,
    secret: 'your-secret-key',
}
const flash = require('connect-flash');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(session({ ...sessionOptions  }));
app.use(flash());
// app.get("/count", (req, res) => {
//     req.session.count = (req.session.count || 0) + 1;  // Increment the count by 1
//     res.send(`You have visited this page ${req.session.count || 0} times.`)
// })


app.get('/test', (req, res) => {
    res.send('Hello World');
});

app.get("/register" , (req, res) => {
    let {name="undefined"} = req.query;
    if(name=="undefined"){
        req.flash("error", "Name is required");
    }
    else{
        req.flash("success", "Registration successful");
        req.session.name = name;
    }
    res.redirect('/hello');
}
)

app.get("/hello", (req, res) => {
    res.locals.successMsg=req.flash('success');
    res.locals.errorMsg=req.flash('error');
    res.render("page.ejs",{name: req.session.name});
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})