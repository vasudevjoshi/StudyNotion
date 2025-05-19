const nodemailer = require('nodemailer');

const mailSender = async (email ,title ,Subject)=>{
    try{
        const transporter = nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS,
        },
     })
     let info = await transporter.sendMail({
        from:'StudyNotion || Vasudev Joshi',
        to:`${email}`,
        subject:`${title}`,
        html:`${Subject}`,
     })
     return info;
    }catch(error){
        console.log(error.message);
    }
     
}
module.exports = mailSender;