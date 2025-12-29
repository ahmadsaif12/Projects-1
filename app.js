const express= require("express");
const mongoose=require("mongoose");
const ejsMate=require('ejs-mate');
const app=express();
const port=4500;
var methodOverride = require('method-override')
let path=require("path");
let Listing=require("./models/listing.js");

//ejs mate
app.engine('ejs', ejsMate);
//setting views
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//setting static files
app.use(express.static(path.join(__dirname,"public")));

//method override
app.use(methodOverride('_method'))

//setting forms
app.use(express.urlencoded({extended:true}));
//connecting to mongoose
const mongo_url='mongodb://127.0.0.1:27017/wanderlust';
main().then(()=>{console.log("connected to db")}).catch((err)=>{console.log(err)});

async function main(){
    await mongoose.connect(mongo_url);
}


//get all listings
app.get("/listings",async(req,res)=>{
    let alllistings = await Listing.find({});
    res.render("listings/index.ejs",{alllistings})
});

//create new listing get request
app.get("/listings/new",(req,res)=>{
   res.render("listings/new.ejs");
});
//new listing
app.post("/listings",async(req,res)=>{
    let newlisting=new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
})

//show all listings
app.get("/listings/:_id",async(req,res)=>{
    let {_id}=req.params;
    let listing= await Listing.findById(_id);
    res.render("listings/show.ejs",{listing})
});
//edit route
app.get("/listings/:_id/edit",async(req,res)=>{
    let {_id}=req.params;
    let listing=await Listing.findById(_id);
    res.render("listings/edit.ejs",{listing});
});
app.put("/listings/:_id",async(req,res)=>{
    let {_id}=req.params;
    let listing=await Listing.findByIdAndUpdate(_id,{...req.body.listing});
    console.log(listing);
    res.redirect("/listings");
})
//delete listings

app.delete("/listings/:_id",async(req,res)=>{
    let {_id}=req.params;
    let deletelistings=await Listing.findByIdAndDelete(_id);
    console.log(deletelistings);
    res.redirect("/listings");
})


//running app
app.listen(port,()=>{
    console.log(`app is running on ${port}`)
});