import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'

async function authUser(req,res,next) {

    const token = req.cookies.token
     
    if(!token){
        const err = new Error("token not found")
        err.status=404
        return next(err)
    }
     
    let userId;

    try{

        userId = jwt.verify(token,process.env.JWT_SECRET)
    }
    catch(err){
        err.status = 403
        return next(err)
    }
    
    let user;
     user = await userModel.findById(userId.id).select("-password")
 
    if(!user){
        const err = new Error("invalid token")
        err.status = 403;
        return next(err)
    }
    if(!user.verified){
         const err = new Error("user is not verified yet")
        err.status = 403;
        return next(err)
    }

    req.userId = user._id
    req.user = user
    next()
    
}
export default authUser