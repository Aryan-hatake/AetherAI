import express from "express";
import handleError from "./middleware/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import cookieParser from "cookie-parser";
import morgan from 'morgan'
import cors from 'cors'
import { fileURLToPath } from 'url'
import path from 'path'
const app = express();

const __filename = fileURLToPath(import.meta.url)
console.log(__filename)
const __dirname = path.dirname(__filename)

app.use(express.urlencoded({ extended: true }));

app.use(express.json())
app.use(express.static('./public')) 
app.use(cookieParser())
app.use(cors({
    origin:"https://aether-chatbot.onrender.com",
    credentials:true
}))
app.use("/api/auth",authRouter)
app.use("/api/chats",chatRouter)
app.use(morgan("dev"))
/*
@ Health-check 
*/

app.use(handleError);

app.use("*name",(req,res)=>{
    res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})
    
export default app;