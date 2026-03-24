import mongoose from "mongoose";

async function connectToDB() {
   
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database connected")
    }
    catch(err){
        console.log(err)
        process.exit(1)
    }
    
}


export default connectToDB
