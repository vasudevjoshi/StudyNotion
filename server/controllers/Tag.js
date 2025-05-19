const Category = require('../models/Category');

exports.createCategory = async(req,res )=>{
    try {
        const {name,description} = req.body;
        
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }
        
        const newCategory = await Category.create({
            name,
            description
        });
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            newCategory
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating Category",
            error: error.message
        });
    }
}
exports.getAllCategory = async(req,res)=>{
    try{
        const allCategorys = await Category.find({},{name:true,description:true});

        return res.status(200).json({
            success:true,
            message:"Categorys fetched Successfully",
            allCategorys
        });
    }catch(error){
                res.status(500).json({
            success: false,
            message: "Error while getting Categorys",
            error: error.message
        });

    }
}