const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
       
    sectionName:{
        type:String,
        required:true,
    },
    subSection:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
    }]

});
const Section =mongoose.model('Section', SectionSchema);
module.exports = Section;