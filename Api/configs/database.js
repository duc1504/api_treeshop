const mongoose = require('mongoose');
require('dotenv').config();


module.exports.connect= async()=>{
    
    try {
        await mongoose.connect(process.env.MONGO_ATLAt);
        console.log("Connected to successfully")
     } catch (error) {
         console.log("Connected to failed")
     }
}
