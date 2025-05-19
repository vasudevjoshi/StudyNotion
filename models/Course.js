const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
       courseName:{
        type:String,
       },
       courseDescription:{
        type:String,
       }, 
       instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
       }, 
       whatYouWillLearn:{
        type:String,
       },
       courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
        }
       ],
       ratingandReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview",
        }
       ],
       price:{
        type:Number,
        required:true,
       },
       thumbnail:{
        type:String,
        required:true,
       },
       tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tag",
       },
       studentEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
       }]

});
const Course =mongoose.model('Course', courseSchema);
module.exports = Course;