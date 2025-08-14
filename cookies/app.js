const express=require('express');
const app=express();
const cookieParser=require('cookie-parser');

app.use(cookieParser("secretcode"));

app.get('/getCookie',(req,res)=>{
    res.cookie('cookieName','cookieValue' );
    console.dir(req.cookies);
    res.send("Cookie send");
})


app.get("/signedCookie",(req,res)=>{
    res.cookie('signedCookieName','signedCookieValue',{signed:true});
    console.log("Signed Cookie send ");
    res.send("Signed Cookie send");
})

app.get("/verify",(req,res)=>{
    console.log("Signed Cookie received: ", req.signedCookies);
    res.send("Signed Cookie received");
})

app.get(("/"),(req,res)=>{
    res.send("Root Route");
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})