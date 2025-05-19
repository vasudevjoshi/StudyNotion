const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
    cousre:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    completedVideos:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
        }],
        default:[]
    }
});
const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);
module.exports = CourseProgress;