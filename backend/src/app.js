import express from "express";
import handleError from "./middleware/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import cookieParser from "cookie-parser";
import morgan from 'morgan'
import cors from 'cors'
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/auth",authRouter)
app.use("/api/chats",chatRouter)
app.use(morgan("dev"))
/*
@ Health-check 
*/
app.get("/",(req,res)=>{
    res.send({
        message:"server is running "
    })
})

app.use(handleError);

export default app;