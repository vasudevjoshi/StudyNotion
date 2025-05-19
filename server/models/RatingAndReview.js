const mongooose = require("mongoose");

const ratingAndReviewSchema = new mongooose.Schema({
    user:{
        type: mongooose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating:{
        type:Number,
        required:true,
        min:1,
    },
    review:{
        type:String,
        required:true,
    },
});

const RatingAndReview = mongooose.model("RatingAndReview", ratingAndReviewSchema);
module.exports = RatingAndReview;