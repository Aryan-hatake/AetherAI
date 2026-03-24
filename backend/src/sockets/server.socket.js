import { Server } from "socket.io";
import aiService from "../services/ai.service.js";
import jwt from "jsonwebtoken"
import { processMessage } from "../utils/processMessage.util.js";
import cookie from "cookie";

let io;

export function initSocket(httpServer) {

    try {

        io = new Server(httpServer, {
            cookie:true,
            cors: {
                origin: "http://localhost:5173",
                credentials: true,
            }
        })

        console.log("Socket.io server is RUNNING")

        io.use((socket, next) => {
            const raw = socket.handshake.headers.cookie || "none"
            
            const cookies = cookie.parse(raw)
            const {token} = cookies
            // parse cookie manually or use a library
  
           console.log("yaha token hai",token)
            let decoded;
            try{
                
               decoded = jwt.verify(token, process.env.JWT_SECRET)
            }
            catch(err){
                console.log("Invalid jwt token")
            }

            socket.userId = decoded.id   // 👈 same concept

            next()
        })
        io.on("connection", (socket) => {
            console.log("a user connected: ", socket.id)

            socket.on("prompt", async (msg) => {
                msg = JSON.parse(msg)    
                const { message,chat } = msg
                const user = socket.userId
                
                const aiMsg = await processMessage(user,message,chat)

                io.emit("ai-response", aiMsg)
            })
        })
    }
    catch (err) {
        console.log(err)
    }
}