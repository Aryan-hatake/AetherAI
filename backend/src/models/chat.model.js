import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true,"this field is required"]
    },
    title:{
        type:String,
         required:[true,"this field is required"]
    },
},
{timestamps:true}
);

const chatModel = mongoose.model("chat",chatSchema);
export default chatModel