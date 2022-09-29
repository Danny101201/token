import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  userName:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
  },
  roles:{
    type:[String],
    enum:["user","admin","super_admin"],
    default:["user"]
  }
})
export default mongoose.model('User', userSchema)