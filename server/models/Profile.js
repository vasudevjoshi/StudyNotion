 const mongoose = require('mongoose');
 const profileSchema = new mongoose.Schema({
    about: {
        type: String,
        trim: true
    },
    contactNumber: {
        type: Number,
        trim: true
    },
    gender :{
        type: String,
    },
    dateOfBirth: {
        type: Date,
    }
 });
 module.exports = mongoose.model('Profile', profileSchema);