import { io } from 'socket.io-client'

export const socket = io("http://aether-chatbot.onrender.com/", {
    withCredentials: true,
    autoConnect: false
})
export function socketConnection() {


    if (!socket.connected) {
        socket.connect();
    }
    socket.off("connect");
    socket.off("connect_error");

    socket.on("connect", () => {
        console.log("the socket has been connected to the server")
    })
    socket.on("connect_error", (err) => {
        console.log("❌ connection error:", err.message);
    });
}