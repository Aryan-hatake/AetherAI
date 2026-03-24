import axios from 'axios'

const api = axios.create({
    baseURL: "https://aether-chatbot.onrender.com/api/auth",
    withCredentials: true
})


export const login = async (email, password) => {
    const response = await api.post("/login", { email, password })
    return response.data
}
export const register = async (email, username, password) => {
    const response = await api.post("/register", { email, username, password })
    return response.data
}
export const getMe = async () => {
    const response = await api.get("/getMe")
    return response.data
}
export const verify = async () => {
    const response = await api.get("/verify")
    return response.data
}
export const resendEmail = async () => {
    const response = await api.post("/resend")
    return response.data
}

