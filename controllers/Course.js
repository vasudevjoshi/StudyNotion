const Course = require('../models/Course');
const Tag = require('../models/Category');
const User = require('../models/User');
const uploadImageToCloudinary = require('../utils/imageUploader');

exports.createCourse = async(req,res)=>{
  try{

      const {courseName, courseDescription,whatYouWillLearn,price,tag} = req.body;
    if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag){
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });

    }
    const thumbnailFile = req.files.thumbnail;
    const instructorid = req.user.id;
    const instructorDetails = await User.findById(instructorid);
    if(!instructorDetails){
        return res.status(404).json({
            success: false,
            message: "Instructor not found"
        });
    }
    const tagDetails = await Tag.findById(tag);
    if(!tagDetails){
        return res.status(404).json({
            success: false,
            message: "Tag not found"
        });
    }
const  thumbnailImage = await uploadImageToCloudinary(thumbnailFile,process.env.FOLDER_NAME);
  
    const newCourse = await Course.create({
        courseName,
        courseDescription,
        whatYouWillLearn,
        price,
        tag,
        instructor: instructorid,
        thumbnail: thumbnailImage.secure_url
    });
       await User.findByIdAndUpdate(instructorid,{
        $push:{
            courses:newCourse._id
        }
     },{new:true});
     await Tag.findByIdAndUpdate(tag,{
        $push:{
            courses:newCourse._id
        }
     },{new:true});

    res.status(201).json({
        success: true,
        message: "Course created successfully",
        newCourse
    });         
  }catch(error){
    console.log("Error in creating course",error.message);
    return res.status(500).json({
        success:false,
        message:"Internal server error",
    });
  }
}
exports.getAllCourses = async(req,res ) =>{
    const AllCoursers = await Course.find({});
    if(!AllCoursers){
        return res.status(404).json({
            success: false,
            message: "No courses found"
        });
    }
    return res.status(200).json({
        success: true,
        message: "Courses fetched successfully",
        AllCoursers
    });
}