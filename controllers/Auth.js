const User = require('../models/User');
const OTP = require('../models/OTP');
const optGenerator = require('otp-generator');
const bcryptjs = require('bcryptjs');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const sendOTP = async (req,res) =>{
    try{
           const {email} = req.body;

    const alreadyUserExists = await User.findOne({email:email});
    if(alreadyUserExists){
        return res.status(400).json({
            success:false,
            message:"User already exists",
        });
    }

    const otp  = optGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });

    let result = await OTP.findOne({otp:otp});
    while(result){
        otp = optGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        result = await OTP.findOne({otp:otp});
    }

    const otpPayload = {
        email:email,
        otp:otp,
    }
    const otpData = await OTP.create(otpPayload);

    return res.status(200).json({
        success:true,
        message:"OTP sent successfully",
        data:otpData,
    });
    }
    catch(error){
        console.log("Error in sending OTP",error.message);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        });
    }
}
const signUp = async (req,res) =>{
    try{
         const {
            firstName,lastName,email,password,confirmPassword,accountType,otp,contactNumber
         } = req.body;
         if(!firstName || !lastName || !email || !password || !confirmPassword|| !otp || !contactNumber){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields",
            });
            
            }
            const alreadyUserExists  = await User.findOne({email:email});
            if(alreadyUserExists){
                return res.status(403).json({
                    success:false,
                    message:"User already exists",
                });
            }
            if(password !== confirmPassword){
                return res.status(400).json({
                    success:false,
                    message:"Password and confirm password should be same",
                });
            }
            const recentOtp = await OTP.findOne({email:email}.sort({createAt:-1})).limit(1);
            if(!recentOtp){
                return res.status(400).json({
                    success:false,
                    message:"OTP not found",
                });
            }
            if(recentOtp.otp !== otp){
                return res.status(400).json({
                    success:false,
                    message:"Invalid OTP",
                });
            }
            const profileDetails = await Profile.create({
                gender:null,
                dateOfBirth:null,
                contactNumber:contactNumber,
                about:null,
            })
            const hashedPassword = await bcryptjs.hash(password,10);
            const userPayload = {
                firstName:firstName,
                lastName:lastName,
                email:email,
                password:hashedPassword,
                accountType:accountType,
                additionalDetails:profileDetails._id,
                image:'https://api.dicebear.com/9.x/initials/svg?seed=${firstName}${lastName}',
        
            }
            const userData = await User.create(userPayload);
            if(userData){
                return res.status(200).json({
                    success:true,
                    message:"User registered successfully",
                    data:userData,
                });
            }
         
        }
    
    catch(error){
        console.log("Error in signing up",error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

const login = async (req,res) =>{
    try{
        const {email,password}  = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields",
            });
        }
        const userData = await User.findOne({email:email});
        if(!userData){
            return res.status(400).json({
                success:false,
                message:"User not found,Pleas sign up",
            });
        }
        const isPasswordMatched = await bcryptjs.compare(password,userData.password);
        if(isPasswordMatched){
            const payload = {
                email:userData.email,
                id:userData._id,
                role: userData.accountType,
            }
            const token = await jwt.sign(payload,process.env.JWT_SECRET_KEY,{
                expiresIn:"1d",
            });
            userData.token = token;
            userData.password = undefined;
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                message:"User logged in successfully",
                token:token,
                data:userData,
            });
        }
        else
        {
            return res.status(400).json({
                success:false,
                message:"Invalid credentials",
            });
        }
    }
    catch(error){
        console.log("Error in logging in",error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if(oldPassword === newPassword){
			return res.status(400).json({
				success: false,
				message: "New Password cannot be same as Old Password",
			});
		}
		
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				"Study Notion - Password Updated",
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};
    
module.exports ={sendOTP,signUp,login,changePassword};