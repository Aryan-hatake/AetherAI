import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"this field is required"],
        unique:[true,'username already exist']
    },
    email:{
        type:String,
        required:[true,"this field is required"],
        unique:[true,'email already exist']
    },
    password:{
        type:String,
        required:[true,"this field is required"],
        
    },
    verified:{
        type:Boolean,
        default:false
    }

},{timestamps:true})



userSchema.pre('save',async function(){
    if(this.isModified("password")){
        this.password  = await bcrypt.hash(this.password,10);
    };
})

userSchema.methods.comparePassword = async function (newPassword) {
    return await bcrypt.compare(newPassword,this.password)
}
const userModel = mongoose.model("users",userSchema);

export default userModel