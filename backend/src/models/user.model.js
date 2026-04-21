const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        unique:[true,"user name must be unique"],
        required:true,
    },
    email:{
        type:String,
        unique:[true,"email already exists"],
        required:true,
       
    },
    password:{
        type:String,
        required:true,
    },
})

const userModel = mongoose.model('users',userSchema);

module.exports = userModel;
