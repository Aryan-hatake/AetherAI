import dotenv from 'dotenv'
dotenv.config()
import app from "./src/app.js";
import connectToDB from './src/config/connect.database.js';
import { initSocket } from './src/sockets/server.socket.js';
import { createServer } from 'node:http';
const server = createServer(app);;
const port = process.env.PORT || 3000

initSocket(server)

connectToDB()
server.listen(port,()=>{
    console.log("server is running on port 3000")
})