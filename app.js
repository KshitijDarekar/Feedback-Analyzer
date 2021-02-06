var express= require("express");
var app= express();

const users = [];
app.set("view engine","ejs") ;

app.use(express.urlencoded({extended : false}))
app.use(express.static(__dirname+"/public"));


app.get("/",(req,res)=>{
    res.render("home");
});

//AUTH ROUTES
//=========================
// SHOW REGISTER FORM
app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",(req,res)=>{
    req.body.email
})

// //show login form
app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/login",(req,res)=>{

})

const port = process.env.PORT || 3000;
const ip = process.env.IP || "0.0.0.0";
app.listen(port,ip ,()=>{
    console.log("THe  server Has started");
    console.log(`Server is running at http://${ip}:${port}`);

 });