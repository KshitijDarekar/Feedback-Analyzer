const express= require("express");
const app= express();
const mongoose = require("mongoose");

const users = [];
app.set("view engine","ejs") ;

app.use(express.urlencoded({extended : false}))
app.use(express.static(__dirname+"/public"));


app.get("/",(req,res)=>{
    res.render("home");
});

//

const url = process.env.DATABASEURL || "mongodb://localhost:27017/feedbackAnalyzer";
// Mongodb Atlas Setup (Cloud)
mongoose.connect(url,
{ useNewUrlParser: true, useUnifiedTopology: true 
}).then( ()=>{
    console.log(url);
    console.log("Connected to DB!");
}).catch( err=>{
    console.log("Error :",err.message);
});

//AUTH ROUTES
//=========================
// SHOW REGISTER FORM
app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",(req,res)=>{
    console.log(req.body);
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