const mongoose = require('mongoose');
const timeStamps =require('mongoose-timestamp');
const userSchema = new mongoose.Schema({
    firstName:{type:String,trim:true},
    lastName:{type:String,trim:true},
    email:{type:String,trim:true,lowercase:true},
    admin:{type:Boolean,trim:true,default:false},
    password:{type:String,trim:true, required:true}
})
userSchema.plugin(timeStamps);
module.exports = mongoose.model('User', userSchema);