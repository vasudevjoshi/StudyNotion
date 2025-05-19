const isLoggedIn = async (req,res,next) =>{
    try{
        const token  = req.cookies.token|| req.body.token || req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Please login to access this resource",
            });
        }
        try{
            const decoded = await jwt.verify(token,process.env.JWT_SECRET_KEY);
            req.user = decoded;
        }catch(error){
            return res.status(401).json({
                success:false,
                message:"Token is invalid",
            });
        }
        next();
    }catch(error){
        console.log("Error in isLoggedIn middleware",error.message);
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token",
        });
    }
}

const isStudent = async(req,res,next) =>{
    try{
        if(req.user.role !== "Student"){
            return res.status(403).json({
                success:false,
                message:"this is protected route for Students ",
            });
        }
        next();
    }catch(error){
        console.log("Error in isStudent middleware",error.message);
        return res.status(403).json({
            success:false,
            message:"Something went wrong while validating the token",
        });
    }
}
const isInstrutor = async(req,res,next) =>{
    try{
        if(req.user.role !== "Instructor"){
            return res.status(403).json({
                success:false,
                message:"this is protected route for Instructor",
            });
        }
        next();
    }catch(error){
        console.log("Error in isStudent middleware",error.message);
        return res.status(403).json({
            success:false,
            message:"Something went wrong while validating the token",
        });
    }
}

module.exports = {isLoggedIn,isStudent,isInstrutor};