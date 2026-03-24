import axios from "axios";

const api = axios.create({
    baseURL:"https://aether-chatbot.onrender.com/api/chats",
    withCredentials:true
})

export async function sendMessage(message,chatId) {
    const response = await api.post("/message",{message,chatId})
    return response.data
}

export async function getChats() {
    const response = await api.get("/mychats")
    return response.data
}
export async function getMessages(chatId) {
    const response = await api.get(`/${chatId}/messages`)
    return response.data
}