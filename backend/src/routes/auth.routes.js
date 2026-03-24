import {Router} from 'express'
import { loginValidator, registerValidator } from '../validation/register.validator.js';
import authController from '../controller/auth.controller.js';
import authUser from '../middleware/auth.middleware.js'
const authRouter = Router();

authRouter.post("/register",registerValidator,authController.register)
authRouter.post("/login",loginValidator,authController.login)
authRouter.get("/verify",authController.verifyEmail)
authRouter.get("/getMe",authUser,authController.getMe)
authRouter.post("/resend",authController.resendEmail)


export default authRouter