const Course = require('../models/Course');
const Section = require('../models/Section');

exports.createSection = async (req, res) => {
    try{
        const{sectionName,courseId} = req.body;
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        const newSection = await Section.create({
            sectionName,
            course: courseId
        });

        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,{
            $push:{
                courseContent:newSection._id
            }
        },{new:true});

        res.status(201).json({
            success: true,
            message: "Section created successfully",
            newSection
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Error creating Section",
            error: error.message
        });
    }
}
exports.updateSection = async (req,res) =>{
    try{
        const{sectionName,sectionId} = req.body;
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }
        const updatedSection =await Section.findByIdAndUpdate(sectionId,{
            sectionName
        },{new:true});
        res.status(200).json({
            success: true,
            message: "Section updated successfully",
            updatedSection
        });

    }catch(error){
        res.status(500).json({
            success: false,
            message: "Error updating Section",
            error: error.message
        });
    }
}
exports.deleteSection = async (req, res) => {
	try {
		const { sectionId,courseId } = req.body;
		await Section.findByIdAndDelete(sectionId);
		// const updatedCourse = await Course.findById(courseId).populate({ path: "courseContent", populate: { path: "subSection" } }).exec();
		res.status(200).json({
			success: true,
			message: "Section deleted",
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};