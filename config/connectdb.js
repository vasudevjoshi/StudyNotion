require('dotenv').config();
const mongosee = require('mongoose');

const connectDB = async() =>{
    mongosee.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('MongoDB connected Successfully');
    }).catch(err => {
        console.error(err.message);
        process.exit(1);
    });
}
module.exports = connectDB;