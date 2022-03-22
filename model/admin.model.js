const { string } = require('joi');
const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name :{
      type:String,
      required:true,
      trim:true
    }
});

module.exports = mongoose.model("admins", adminSchema);