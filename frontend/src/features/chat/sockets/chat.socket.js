import { socket } from "../../auth/sockets/auth.socket";


export function prompt(msg, chat) {

    if (!socket.connected) {
        console.log("❌ socket not connected");
        return;
    }
    const jsonMsg = JSON.stringify({ message: msg, chat })
    socket.emit("prompt", jsonMsg)

}

export const registerAIListener = (callback) => {
    socket.on("ai-response", callback)
}

export const removeAIListener = (callback) => {
    socket.off("ai-response", callback)
}