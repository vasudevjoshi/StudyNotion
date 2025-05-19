const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now(),
        expires: 300
    }
});

async function sendVerificationEmail(email,otp){
    try{
        const isMailSent = await mailSender(email,"Verification Email from the StudyNotion",otp);
        if(isMailSent){
            console.log("Email sent successfully" ,mailSender);
        }
        else{
            console.log("Email not sent");
        }
    }
    catch(error){
        console.log("error occured in sending email",error.message);
    }
}

otpSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
});

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;