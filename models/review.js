const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    created_at:{
        type:Date,
        default:Date.now()
    }
})
let Review = mongoose.model("Review", reviewSchema);
module.exports = Review;