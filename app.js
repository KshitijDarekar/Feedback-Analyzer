const express= require("express");
const app= express();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const session = require('express-session');

const users = [];
app.set("view engine","ejs") ;

app.use(express.urlencoded({extended : false}))
app.use(express.static(__dirname+"/public"));
app.use(session({
  secret: 'Kshitij was here !',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true }
}))

app.get("/",(req,res)=>{
    res.render("home");
});

//Mongodb Setup
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

//UserSchema
const UserSchema = new mongoose.Schema({
    username : { type:String , required:[true,'Username cannot be blank'] , unique:true},
    password : { type:String ,required:true },
    email : { type:String ,required:true , unique:true},
    type : { type:String ,},
    
});
const User= mongoose.model("User",UserSchema);
// const check = new User({username:"Kshitij",password:"123"});
// check.save();

//AUTH ROUTES
//=========================
// SHOW REGISTER FORM
app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",async (req,res)=>{
    console.log(req.body);
    try{
        const hash = await bcrypt.hash(req.body.password,12);
        const newUser = new User({
            username:req.body.username,
            password:hash,
            email:req.body.email,
            type:req.body.type,
        } );
        await newUser.save();
        req.session.user_id=newUser._id;
        console.log(req.body);
        res.send(req.body);
    }catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error Occured");
      }
    
})

// //show login form
app.get("/login",(req,res)=>{
    res.render("login");
})

// ---------------- Code below issue-----------
// app.post("/login",async (req,res)=>{
//     const {username,password}=req.body;
//     //const username=req.body.username;
//     //const password=req.body.password;

//     const user =  await User.find({username:username});

//     const validPassword = await bcrypt.compare(password,user.password);
    
//     // if(validPassword){
//     //     res.send("Welcome");
//     // }
//     // else{
//     //     res.send("Try Again");
//     // }

//     // console.log("uSER DATA IS = "+ user);
//     // if(password==user.password){
//     if(validPassword){
//         res.send("Welcome "+ user.username);
//     }
//     else{
//         res.send("Try Again! Incorrect Username or Password");
//         console.log("entered username = "+ user.username + "  "+"entered password = "+ user.password)
//     }

//     //const {username,password}=req.body;
//     const db_user = User.findOne({username}).then(data => data);
//     console.log("Ye please :" + db_user);
//     res.send(req.body);
// })
// -------------

app.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      console.log(user);
      if (user) {
        const cmp = await bcrypt.compare(req.body.password, user.password);
        if (cmp) {
          //   ..... further code to maintain authentication like jwt or sessions
          req.session.user_id=user._id;
          res.send("Auth Successful");
          //res.redirect("/secret");
        } else {
          res.send("Wrong username or password.");
        }
      } else {
        res.send("Wrong username or password.");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server error Occured");
    }
  });

  app.get("/secret",(req,res)=>{
    if(!req.session.user_id){
      res.redirect("/login");
    }
    else{
      res.send("This is the  secret page , you cannot see unless you are logged in !");
    }
    
  })
const port = process.env.PORT || 3000;
const ip = process.env.IP || "0.0.0.0";
app.listen(port,ip ,()=>{
    console.log("THe  server Has started");
    console.log(`Server is running at http://${ip}:${port}`);

 });