import aiService from "../services/ai.service.js"
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js"
import { processMessage } from "../utils/processMessage.util.js"

async function sendMessage(req, res, next) {

    const user = req.userId

    const { message, chatId } = req.body

    const {response,title,chat} = await processMessage(user,message,chatId)
   

    res.status(201).json({
        aiMessage: response,
        title,
        chat:chat
    })
}
async function getMessages(req, res, next) {
    const { chatId } = req.params
    const user = req.userId

    const chatExist = await chatModel.find({
        chat: chatId,
        user
    })

    if (!chatExist) {
        const err = new Error("chat does not exist")
        err.status = 404
        return next(err)
    }

    const allMessage = await messageModel.find({
        chat: chatId
    })

    return res.status(200).json({
        message: "all messages fetch successfully",
        allMessage
    })

}
async function getChats(req, res, next) {
    const user = req.userId
    const allChats = await chatModel.find({
        user
    })
    res.status(200).json({
        message: "all chats fetched successfully",
        allChats
    })
}
async function deleteChat(req, res, next) {
    const { chatId } = req.params
    const user = req.userId
    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user
    })
    if (!chat) {
        const err = new Error("no chat found")
        err.status = 404
        return next(err)
    }
    const messages = await messageModel.deleteMany({ chat: chatId })

    res.status(200).json({
        message: "chat has been deleted successfully",
        chat,
        messages
    })
}
export default { sendMessage, getMessages, getChats, deleteChat }